class LineplotGraph {
  constructor() {
    this.data = null
    this.margin = { top: 30, right: 30, bottom: 70, left: 60 };

    this.width = 700 - this.margin.left - this.margin.right,
      this.height = 400 - this.margin.top - this.margin.bottom;

    this.svg = d3.select("#lineplot")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3.scaleLinear().range([0, this.width]);
    this.xAxis = d3.axisBottom().scale(this.x);
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "myXaxis")

    this.y = d3.scaleLinear().range([this.height, 0]);
    this.yAxis = d3.axisLeft().scale(this.y);
    this.svg.append("g")
      .attr("class", "myYaxis")

    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("y", 330)
      .attr("x", 300)
      .attr("id", "xAxisText")
      .attr("dy", ".90em")
      .text("Ano");

    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("y", -50)
      .attr("x", -30)
      .attr("id", "yAxisText")
      .attr("dy", ".90em")
      .attr("transform", "rotate(-90)")
      .text("Número total de feridos em acidentes");
  }

  setDados(dataSelector) {
    if (dataSelector == 1) {
      this.data = this.data1;
    } else if (dataSelector == 2) {
      this.data = this.data2;
    }
  }

  groupWoundedByYear(data) {
    let set = []

    data.reduce(function (res, value) {
      if (!res[value.ano]) {
        res[value.ano] = { group: value.ano, value: 0 };
        set.push(res[value.ano])
      }
      res[value.ano].value += value.feridos;
      return res;
    }, {});

    return set;
  }

  groupDeathsByYear(data) {
    let set = [];

    data.reduce(function (res, value) {
      if (!res[value.ano]) {
        res[value.ano] = { group: value.ano, value: 0 };
        set.push(res[value.ano])
      }
      res[value.ano].value += value.mortos;
      return res;
    }, {});

    return set;
  }

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        ano: d.ano,
        feridos: +d.feridos,
        mortos: +d.mortos
      }
    });

    this.data1 = this.groupWoundedByYear(data);
    this.data2 = this.groupDeathsByYear(data);
  }
}

async function load(lineplot) {
  await lineplot.loadCSV('../../data/data.csv');
  update(1)
}

let lineplotGraph = new LineplotGraph();
load(lineplotGraph);

function update(dataSelector) {

  lineplotGraph.setDados(dataSelector);

  lineplotGraph.x.domain([2007, d3.max(lineplotGraph.data, function (d) { return d.group })]);
  lineplotGraph.svg.selectAll(".myXaxis").transition()
    .duration(2000)
    .call(lineplotGraph.xAxis);

  lineplotGraph.y.domain([0, d3.max(lineplotGraph.data, function (d) { return d.value })]);
  lineplotGraph.svg.selectAll(".myYaxis")
    .transition()
    .duration(2000)
    .call(lineplotGraph.yAxis);

  var u = lineplotGraph.svg.selectAll(".lineTest")
    .data([lineplotGraph.data], function (d) { return d.value });

  u
    .enter()
    .append("path")
    .attr("class", "lineTest")
    .merge(u)
    .transition()
    .duration(2000)
    .attr("d", d3.line()
      .x(function (d) { return lineplotGraph.x(d.group); })
      .y(function (d) { return lineplotGraph.y(d.value); }))
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2.5)

    if (dataSelector == 1) {
      lineplotGraph.svg.selectAll("#yAxisText")
        .text("Número total de feridos em acidentes")
    } else {
      lineplotGraph.svg.selectAll("#yAxisText")
        .text("Número total de mortos em acidentes")
    }
}