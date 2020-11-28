class BarplotsByPeriod {
  constructor() {
    this.data = null

    this.margin = {top: 30, right: 30, bottom: 70, left: 60};

    this.width = 460 - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;

    // append the svg object to the body of the page
    this.svg = d3.select("#main1")
    .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Initialize the X axis
    this.x = d3.scaleBand()
      .range([ 0, this.width ])
      .padding(0.2);
    this.xAxis = this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")

    // Initialize the Y axis
    this.y = d3.scaleLinear()
      .range([ this.height, 0]);
    this.yAxis = this.svg.append("g")
      .attr("class", "myYaxis")
  }

  setDados(dataSelector) {
    if (dataSelector == 1) {
      this.data = this.data1;
    } else if (dataSelector == 2) {
      this.data = this.data2;
    }
  }

  groupByDiaSemana(data) {
    let bars = [];

    data.reduce(function(res, value) {
      if (!res[value.dia_semana]) {
        res[value.dia_semana] = { group: value.dia_semana, value: 0 };
        bars.push(res[value.dia_semana])
      }
      res[value.dia_semana].value = res[value.dia_semana].value + 1;
      return res;
    }, {});

    return bars;
  }

  groupByMes(data) {
    let bars = [];

    data.reduce(function(res, value) {
      if (!res[value.mes_acidente]) {
        res[value.mes_acidente] = { group: value.mes_acidente, value: 0 };
        bars.push(res[value.mes_acidente])
      }
      res[value.mes_acidente].value = res[value.mes_acidente].value + 1;
      return res;
    }, {});

    return bars;
  }

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      let accidentDate = new Date(d.data_inversa);
      let accidentMonth = accidentDate.getMonth()
      return {
        data_inversa: d.data_inversa,
        dia_semana: d.dia_semana,
        mes_acidente: accidentMonth
      }
    });

    this.data1 = this.groupByDiaSemana(data);
    this.data2 = this.groupByMes(data);
  }
}

async function loadInfo(barplotsByPeriod) {
  await barplotsByPeriod.loadCSV('../../data/data.csv');
  
  // Initialize the plot with the first dataset
  update(1)
}

let barplotsByPeriod = new BarplotsByPeriod();
loadInfo(barplotsByPeriod);

// Função para criar e dar update no grágico
async function update(dataSelector) {
  
  barplotsByPeriod.setDados(dataSelector);

  // Update the X axis
  barplotsByPeriod.x.domain(barplotsByPeriod.data.map(function(d) { return d.group; }))
  barplotsByPeriod.xAxis.transition().duration(1000).call(d3.axisBottom(barplotsByPeriod.x))

  // Update the Y axis
  barplotsByPeriod.y.domain([0, d3.max(barplotsByPeriod.data, function(d) { return d.value }) ]);
  barplotsByPeriod.yAxis.transition().duration(1000).call(d3.axisLeft(barplotsByPeriod.y));

  // Create the u variable
  var u = barplotsByPeriod.svg.selectAll("rect")
    .data(barplotsByPeriod.data)

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return barplotsByPeriod.x(d.group); })
      .attr("y", function(d) { return barplotsByPeriod.y(d.value); })
      .attr("width", barplotsByPeriod.x.bandwidth())
      .attr("height", function(d) { return barplotsByPeriod.height - barplotsByPeriod.y(d.value); })
      .attr("fill", "#69b3a2")

  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove()
}