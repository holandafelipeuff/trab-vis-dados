export class Lineplot2 {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

    this.set = []

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

  groupByYear(data) {
    let set = [];

    data.reduce(function(res, value) {
      if (!res[value.ano]) {
        res[value.ano] = { ano: value.ano, mortos: 0 };
        set.push(res[value.ano])
      }
      res[value.ano].mortos += value.mortos;
      return res;
    }, {});

    return set;
  }

  async loadCSV(file) {
    let preData = await d3.csv(file, d => {
      return {
        ano: +d.ano,
        mortos: +d.mortos,
      }
    });
    this.set = this.groupByYear(preData);
  }
/*
  createScales() {
    let xExtent = d3.extent(this.data, d => {
      return d.km;
    });

    let yExtent = d3.extent(this.data, d => {
      return d.pessoas;
    });

    this.xScale = d3.scaleLinear().domain(xExtent).range([0, this.config.width]);
    this.yScale = d3.scaleLinear().domain(yExtent).range([this.config.height, 0]);
  }
*/
  createScales() {
    const tipo = this.set.map(d => {
      return d.ano;
    });

    let yExtent = d3.extent(this.set, d => {
      return d.mortos;
    });

    console.log(yExtent)

    this.xScale = d3.scaleBand().domain(tipo).range([0, this.config.width]);
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
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -200)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Número de mortos em acidentes");

    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.config.width/2 + 100) + " ," + 
                           (this.config.height + this.config.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Ano");
  }

  renderLines() {
    this.margins
      .append('path')
        .datum(this.set)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(d => this.xScale(d.ano))
          .y(d => this.yScale(d.mortos))
        )
  }


}