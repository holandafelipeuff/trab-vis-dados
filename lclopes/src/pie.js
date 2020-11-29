class PieChart {
  constructor() {
    this.width = 450
    this.height = 450
    this.margin = 40
    this.radius = Math.min(this.width, this.height) / 2 - this.margin

    this.svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    //this.data1 = { a: 9, b: 20, c: 30, d: 8, e: 12 }
    //this.data2 = { a: 6, b: 16, c: 20, d: 14, e: 19, f: 12 }
    this.data = null
    this.data1 = [];
    this.data2 = [];
    //this.color = d3.scaleOrdinal()
    //.domain(pieChart.data.map(function(d) { return d.group; }))
    //.range(d3.schemeDark2);
    
  }

  setDados(dataSelector) {
    if (dataSelector == 1) {
      this.data = this.data1;
    } else if (dataSelector == 2) {
      this.data = this.data2;
    }
  }

  groupPhaseDay(data) {
    let slices = [];

    data.reduce(function (res, value) {
      if (!res[value.fase_dia]) {
        res[value.fase_dia] = { group: value.fase_dia, value: 0 };
        slices.push(res[value.fase_dia])
      }
      
      res[value.fase_dia].value += 1;
      return res;
    }, {});

    return slices;
  }

  groupWeather(data) {
    let slices = [];

    data.reduce(function (res, value) { 
      if (!res[value.condicao_metereologica]) {
        res[value.condicao_metereologica] = { group: value.condicao_metereologica, value: 0 };
        slices.push(res[value.condicao_metereologica])
      }

      res[value.condicao_metereologica].value += 1;
      return res;
    }, {});

    return slices;
  }

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        ano: +d.ano,
        fase_dia: +d.fase_dia,
        condicao_metereologica: +d.condicao_metereologica
      }
    });

    this.data1 = this.groupPhaseDay(data);
    this.data2 = this.groupWeather(data);
  }
}

async function load(pie) {
  await pie.loadCSV('../../data/data.csv');
  update(1)
}

let pieChart = new PieChart();
load(pieChart)

// A function that create / update the plot for a given variable:
function update(dataSelector) {

  pieChart.setDados(dataSelector);

  console.log(pieChart.data1);
  console.log(pieChart.data2);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function (d) { return d.value; })
    .sort(function (a, b) { console.log(a); return d3.ascending(a.key, b.key); }) // This make sure that group order remains
  //the same in the pie chart
  var data_ready = pie(d3.entries(pieChart.data))

  var color = d3.scaleOrdinal()
  .domain(pieChart.data.map(function(d) { return d.group; }))
  .range(d3.schemeDark2);
  // map to data
  var u = pieChart.svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(pieChart.radius)
    )
    .attr('fill', function (d) { return (color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

  // remove the group that is not present anymore
  u
    .exit()
    .remove()

}
