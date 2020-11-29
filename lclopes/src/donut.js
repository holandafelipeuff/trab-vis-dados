class DonutLabeled {
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

    // Create dummy data
    //this.data = { a: 9, b: 20, c: 30, d: 8, e: 12, f: 3, g: 7, h: 14 }

    this.data = null
  }

  groupPeopleByYear(data) {
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

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        ano: +d.ano,
        feridos: +d.feridos,
      }
    });

    this.data = this.groupPeopleByYear(data);
  }
}

async function loadAndCreate(donut) {
  await donut.loadCSV('../../data/data.csv');
  create()
}

let donut = new DonutLabeled();
loadAndCreate(donut)

function create() {
  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(function (d) { return d.group; })
  var data_ready = pie(d3.entries(donut.data))

  // The arc generator
  var arc = d3.arc()
    .innerRadius(donut.radius * 0.5)         // This is the size of the donut hole
    .outerRadius(donut.radius * 0.8)

  // Another arc that won't be drawn. Just for labels positioning
  var outerArc = d3.arc()
    .innerRadius(donut.radius * 0.9)
    .outerRadius(donut.radius * 0.9)

  var color = d3.scaleOrdinal()
  .domain(donut.data.map(function(d) { return d.value; }))
  .range(d3.schemeDark2);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  donut.svg
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d) { return (color(d.data.value)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

  // Add the polylines between chart and labels:
  donut.svg
    .selectAll('allPolylines')
    .data(data_ready)
    .enter()
    .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function (d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = donut.radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

  // Add the polylines between chart and labels:
  donut.svg
    .selectAll('allLabels')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function (d) { console.log(d.data.key); return d.data.key })
    .attr('transform', function (d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = donut.radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return 'translate(' + pos + ')';
    })
    .style('text-anchor', function (d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
    })

}