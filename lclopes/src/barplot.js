export class Barplot {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

    this.bars = []

    this.createSvg();
    this.createMargins();
  }

  createSvg() {
    this.svg = d3.select(this.config.div)
      .append("svg")
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', this.config.width + this.config.left + this.config.right)
      .attr('height', this.config.height + this.config.top + this.config.bottom);

  }

  createMargins() {
    this.margins = this.svg
      .append('g')
      .attr("transform", `translate(${this.config.left},${this.config.top})`)
  }

  groupByCountry(data) {
    let bars = [];

    data.reduce(function(res, value) {
      if (!res[value.country]) {
        res[value.country] = { country: value.country, emission: 0 };
        bars.push(res[value.country])
      }
      res[value.country].emission += value.emission;
      return res;
    }, {});

    return bars;
  }

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        country: d.country,
        emission: +d.emission,
      }
    });
    if (this.config.year == null)
    this.bars = this.groupByCountry(data);
  }

  createScales() {
    const countries = this.bars.map(d => {
      return d.country;
    });

    let yExtent = d3.extent(this.bars, d => {
      return d.emission;
    });

    this.xScale = d3.scaleBand().domain(countries).range([0, this.config.width]);
    this.yScale = d3.scaleLinear().domain(yExtent).nice().range([this.config.height, 0]);
  }

  createAxis() {
    let xAxis = d3.axisBottom(this.xScale);

    let yAxis = d3.axisLeft(this.yScale);

    this.margins
      .append("g")
      .attr("transform", `translate(0,${this.config.height})`)
      .call(xAxis)
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    this.margins
      .append("g")
      .call(yAxis);

    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.config.width/2 + 100) + " ," + 
                           (this.config.height + this.config.top + 90) + ")")
      .style("text-anchor", "middle")
      .text("Maiores potências econômicas do mundo e o Brasil");

    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -200)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Emissão acumulada de CO2");
  }

  renderBars() {
    this.margins.selectAll('rect')
      .data(this.bars)
      .enter()
      .append('rect')
        .attr('x', d => this.xScale(d.country))
        .attr("width", this.xScale.bandwidth())
        .attr('fill', '#69b3a2')
        .attr("height", d => this.config.height - this.yScale(0))
        .attr('y', d => this.yScale(0));
  }

  renderAnimationOnLoading() {
    this.margins.selectAll('rect')
      .transition()
      .duration(800)
      .attr("y", d => this.yScale(d.emission))
      .attr("height", d => this.config.height - this.yScale(d.emission))
      .delay((d,i) => {return(i*100)})
  }

}

export function update(data) {

  var u = svg.selectAll("rect")
    .data(data)
    u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return x(d.country); })
      .attr("y", function(d) { return y(d.emission); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.emission); })
      .attr("fill", "#69b3a2")

      u
      .exit()
      .remove()
}