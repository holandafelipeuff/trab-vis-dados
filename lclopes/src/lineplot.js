export class Lineplot {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

    this.data = []

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

  async loadCSV(file, country) {
    let preData = await d3.csv(file, d => {
      if(d.year > 1850 && d.country == country) {
        return {
          year: +d.year,
          emission: +d.emission,
        }
      }
      
    });
    this.data = preData;
  }

  createScales() {
    let xExtent = d3.extent(this.data, d => {
      return d.year;
    });

    let yExtent = d3.extent(this.data, d => {
      return d.emission;
    });

    this.xScale = d3.scaleLinear().domain(xExtent).range([0, this.config.width]);
    this.yScale = d3.scaleLinear().domain(yExtent).range([this.config.height, 0]);
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
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -200)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Emissão de CO2");

    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.config.width/2 + 100) + " ," + 
                           (this.config.height + this.config.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Ano (de 1850 a 2017)");
  }

  renderLines() {
    this.margins
      .append('path')
        .datum(this.data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(d => this.xScale(d.year))
          .y(d => this.yScale(d.emission))
        )
  }


}