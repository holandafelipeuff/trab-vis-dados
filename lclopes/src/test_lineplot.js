class LineplotsTest {
  constructor() {
    /*
    this.data1 = [
      { ser1: 0.3, ser2: 4 },
      { ser1: 2, ser2: 16 },
      { ser1: 3, ser2: 8 }
    ];

    this.data2 = [
      { ser1: 1, ser2: 7 },
      { ser1: 4, ser2: 1 },
      { ser1: 6, ser2: 8 }
    ];
    */
    this.data = null

    this.margin = { top: 30, right: 30, bottom: 70, left: 60 };

    this.width = 460 - this.margin.left - this.margin.right,
      this.height = 400 - this.margin.top - this.margin.bottom;

    this.svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
        // Initialise a X axis:
    this.x = d3.scaleLinear().range([0,this.width]);
    this.xAxis = d3.axisBottom().scale(this.x);
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class","myXaxis")
    
    // Initialize an Y axis
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.yAxis = d3.axisLeft().scale(this.y);
    this.svg.append("g")
      .attr("class","myYaxis")
    
  }

  setDados(dataSelector) {
    if (dataSelector == 1) {
      this.data = this.data1;
    } else if (dataSelector == 2) {
      this.data = this.data2;
    }
  }

  groupPeopleByYear(data) {
    let set = [];

    data.reduce(function(res, value) {
      if (!res[value.ano]) {
        res[value.ano] = { group: value.ano, value: 0 };
        set.push(res[value.ano])
      }
      res[value.ano].value += value.pessoas;
      return res;
    }, {});

    return set;
  }

  groupDeathsByYear(data) {
    let set = [];

    data.reduce(function(res, value) {
      if (!res[value.ano]) {
        res[value.ano] = { group: value.ano, value: 0 };
        set.push(res[value.ano])
      }
      res[value.ano].value = value.mortos;
      return res;
    }, {});

    return set;
  }

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        ano: d.ano,
        pessoas: d.pessoas,
        mortos: d.mortos
      }
    });

    this.data1 = this.groupPeopleByYear(data);
    this.data2 = this.groupDeathsByYear(data);
  }
}

async function load(lineplot) {
  await lineplot.loadCSV('../../data/data.csv');
  update(1)
}

let lineplotsTest = new LineplotsTest();
load(lineplotsTest);

// Create a function that takes a dataset as input and update the plot:
function update(dataSelector) {
    
  lineplotsTest.setDados(dataSelector);
  
  // Create the X axis:
  lineplotsTest.x.domain([0, d3.max(lineplotsTest.data, function(d) { return d.group }) ]);
  lineplotsTest.svg.selectAll(".myXaxis").transition()
    .duration(2000)
    .call(lineplotsTest.xAxis);

  // create the Y axis
  lineplotsTest.y.domain([0, d3.max(lineplotsTest.data, function(d) { return d.value  }) ]);
  lineplotsTest.svg.selectAll(".myYaxis")
    .transition()
    .duration(2000)
    .call(lineplotsTest.yAxis);

  // Create a update selection: bind to the new data
  var u = lineplotsTest.svg.selectAll(".lineTest")
    .data([lineplotsTest.data], function(d){ return d.value });

  // Updata the line
  u
    .enter()
    .append("path")
    .attr("class","lineTest")
    .merge(u)
    .transition()
    .duration(2000)
    .attr("d", d3.line()
      .x(function(d) { return lineplotsTest.x(d.group); })
      .y(function(d) { return lineplotsTest.y(d.value); }))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
}