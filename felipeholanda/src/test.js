
function groupByDiaSemana(data) {
    let bars = [];

    data.reduce(function(res, value) {
        if (!res[value.dia_semana]) {
        res[value.dia_semana] = { dia_semana: value.dia_semana, qtd_acidentes: 0 };
        bars.push(res[value.dia_semana])
        }
        res[value.dia_semana].qtd_acidentes = res[value.dia_semana].qtd_acidentes + 1;
        return res;
    }, {});

    return bars;
}

function groupByMes(data) {
    let bars = [];

    data.reduce(function(res, value) {
        if (!res[value.mes_acidente]) {
        res[value.mes_acidente] = { mes_acidente: value.mes_acidente, qtd_acidentes: 0 };
        bars.push(res[value.mes_acidente])
        }
        res[value.mes_acidente].qtd_acidentes = res[value.mes_acidente].qtd_acidentes + 1;
        return res;
    }, {});

    return bars;
}

async function loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        data_inversa: d.data_inversa,
        dia_semana: d.dia_semana
      }
    });
    return data;
}

let data = loadCSV("../../data/data.csv");

let data1 = this.groupByDiaSemana(data);
let data2 = this.groupByMes(data);

/*

// create 2 data_set
var data1 = [
   {group: "A", value: 4},
   {group: "B", value: 16},
   {group: "C", value: 8}
];

var data2 = [
   {group: "A", value: 7},
   {group: "B", value: 1},
   {group: "C", value: 20},
   {group: "D", value: 10}
];

*/


// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#main1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(data) {

    let xExtent = data.map(d => {
        if (data == data1) {
            return d.dia_semana;
        } else if (data == data2) {
            return d.mes_acidente;
        }
    });

    let yExtent = d3.extent(data, d => {
        return d.qtd_acidentes;
    });

    // Update the X axis
    x.domain(xExtent)
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain(yExtent);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect")
        .data(data)

    u
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(1000)
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2")

    // If less group in the new dataset, I delete the ones not in use anymore
    u
        .exit()
        .remove()
}

// Initialize the plot with the first dataset
update(data1)
