class ScatterplotsClass {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

    this.cat1Scale = null;
    this.cat2Scale = null;
    this.cat3Scale = null;

    this.circles = []

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

  filterHoaPrice(hoaPrice) {
    return (hoaPrice < 5000 && hoaPrice !== 0); 
  }

  filterFloor(floor) {
    return (typeof floor == 'number');
  }

  filterArea(area) {
    return (area < 2000)
  }

  async loadCSV(file) {
    this.circles = await d3.csv(file, d => {
      if (this.filterHoaPrice(+d.hoaPrice) && this.filterFloor(+d.floor) && this.filterArea(+d.area)) {
        return {
          cx: +d.hoaPrice,
          cy: +d.area,
          cat1: d.city,
          cat2: +d.rooms,
          cat3: +d.floor,
          r: 4
        }
      }
    });

    if (this.config.dataSelector === 1) {
      this.circles = this.circles.slice(0, 5000);
    } else {
      this.circles = this.circles.slice(5001, 10000);
    }
  }

  createScales() {
    let xExtent = d3.extent(this.circles, d => {
      return d.cx;
    });
    let yExtent = d3.extent(this.circles, d => {
      return d.cy;
    });

    const cats1 = this.circles.map(d => {
      return d.cat1;
    });
    let cat1Extent = d3.union(cats1);

    const cats2 = this.circles.map(d => {
      return d.cat2;
    });
    let cat2Extent = d3.union(cats2);

    let cat3Extent = d3.extent(this.circles, d => {
      return d.cat3;
    });

    this.xScale = d3.scaleLinear().domain(xExtent).nice().range([0, this.config.width]);
    this.yScale = d3.scaleLinear().domain(yExtent).nice().range([this.config.height, 0]);

    this.cat1Scale = d3.scaleOrdinal().domain(cat1Extent).range(d3.schemeTableau10);
    this.cat2Scale = d3.scaleOrdinal().domain(cat2Extent).range(d3.schemeTableau10);
    this.cat3Scale = d3.scaleSequential(d3.interpolateOrRd).domain(cat3Extent);
  }

  createAxis() {
    let xAxis = d3.axisBottom(this.xScale)
      .ticks(15);
 
    let yAxis = d3.axisLeft(this.yScale)
      .ticks(15);

    this.margins
      .append("g")
      .attr("transform", `translate(0,${this.config.height})`)
      .call(xAxis);

    this.margins
      .append("g")
      .call(yAxis);

    this.svg.append("text")
      .attr("transform",
            "translate(" + (this.config.width/2 + this.config.left) + " ," + 
                           (this.config.height + this.config.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Preço do condomínio");

    this.svg.append("text")
      .attr("transform",
            "translate(" + (this.config.width/2 + this.config.left) + " ," + 
                           (this.config.height + this.config.top + 80) + ")")
      .style("text-anchor", "middle")
      .text("Cores simbolizam números de quartos");

    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -200)
      .attr("dy", ".90em")
      .attr("transform", "rotate(-90)")
      .text("Área da moradia");
  }

  renderCircles() {
    this.margins.selectAll('circle')
      .data(this.circles)
      .join('circle')
      .attr('cx', d => this.xScale(d.cx))
      .attr('cy', d => this.yScale(d.cy))
      .attr('r' , d => d.r)
      //.attr('fill', d => this.cat1Scale(d.cat1));
      .attr('fill', d => this.cat2Scale(d.cat2));
      //.attr('fill', d => this.cat3Scale(d.cat3));
  }
}

class BarplotsClass {
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
  
  groupByCity(data) {
    let bars = [];

    data.reduce(function(res, value) {
      if (!res[value.city]) {
        res[value.city] = { city: value.city, totalPrice: 0 };
        bars.push(res[value.city])
      }
      res[value.city].totalPrice += value.totalPrice;
      return res;
    }, {});

    return bars;
  }

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        city: d.city,
        totalPrice: +d.totalPrice,
      }
    });
    this.bars = this.groupByCity(data);
  }

  createScales() {
    const cities = this.bars.map(d => {
      return d.city;
    });

    let yExtent = d3.extent(this.bars, d => {
      return d.totalPrice;
    });

    this.xScale = d3.scaleBand().domain(cities).range([0, this.config.width]);
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
            "translate(" + (this.config.width/2 + this.config.left) + " ," + 
                           (this.config.height + this.config.top + this.config.bottom) + ")")
      .style("text-anchor", "middle")
      .text("Cidades do Dataset");

    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -200)
      .attr("dy", ".90em")
      .attr("transform", "rotate(-90)")
      .text("Soma dos valores de aluguéis");
  }

  renderBars() {
    this.margins.selectAll('rect')
      .data(this.bars)
      .enter()
      .append('rect')
        .attr('x', d => this.xScale(d.city))
        .attr("width", this.xScale.bandwidth())
        .attr('fill', '#69b3a2')
        .attr("height", d => this.config.height - this.yScale(0))
        .attr('y', d => this.yScale(0));
  }

  renderAnimationOnLoading() {
    this.margins.selectAll('rect')
      .transition()
      .duration(800)
      .attr("y", d => this.yScale(d.totalPrice))
      .attr("height", d => this.config.height - this.yScale(d.totalPrice))
      .delay((d,i) => {return(i*100)})
  }
}

class BarplotsChangeDataClass {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

    this.bars = [];
    this.bars1 = [];
    this.bars2 = [];

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
  
  groupByCity(data) {
    let bars = [];

    data.reduce(function(res, value) {
      if (!res[value.city]) {
        res[value.city] = { city: value.city, totalPrice: 0 };
        bars.push(res[value.city])
      }
      res[value.city].totalPrice += value.totalPrice;
      return res;
    }, {});

    return bars;
  }

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
        return {
          city: d.city,
          totalPrice: +d.totalPrice,
      }
    });
    this.bars = this.groupByCity(data.slice(0, 10000));
    this.bars1 = this.groupByCity(data.slice(0, 5000));
    this.bars2 = this.groupByCity(data.slice(5001, 10000));
  }

  createScales() {
    const cities = this.bars.map(d => {
      return d.city;
    });

    let yExtent = d3.extent(this.bars, d => {
      return d.totalPrice;
    });

    this.xScale = d3.scaleBand().domain(cities).range([0, this.config.width]);
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
  }

  renderBars(dataSelector) {
    
      this.margins.selectAll('rect')
        .data(dataSelector === 1 ? this.bars1 : this.bars2)
        .enter()
        .append('rect')
        .merge(this.margins)
        .transition()
        .duration(1000)
          .attr('x', d => this.xScale(d.city))
          .attr('y', d => this.yScale(d.totalPrice))
          .attr("width", this.xScale.bandwidth())
          .attr("height", d => this.config.height - this.yScale(d.totalPrice))
          .attr('fill', '#69b3a2');
  }
}

class LineplotsClass {
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
  
  groupByYear(preData) {
    let data = [];

    preData.reduce(function(res, value) {
      if (!res[value.year]) {
        res[value.year] = { year: value.year, state: value.state, number: 0 };
        data.push(res[value.year])
      }
      res[value.year].number += value.number;
      return res;
    }, {});

    return data;
  }

  async loadCSV(file) {
    let preData = await d3.csv(file, d => {
      return {
        year: +d.year,
        state: d.state,
        number: +d.number,
      }
    });
    this.data = this.groupByYear(preData);
  }

  createScales() {
    let xExtent = d3.extent(this.data, d => {
      return d.year;
    });

    let yExtent = d3.extent(this.data, d => {
      return d.number;
    });

    this.xScale = d3.scaleLinear().domain(xExtent).range([0, this.config.width]);
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
            "translate(" + (this.config.width/2 + this.config.left) + " ," + 
                           (this.config.height + this.config.top + this.config.bottom) + ")")
      .style("text-anchor", "middle")
      .text("Ano");

    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -200)
      .attr("dy", ".90em")
      .attr("transform", "rotate(-90)")
      .text("Número de queimadas reportadas");
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
          .y(d => this.yScale(d.number))
        )
  }
}

let barplotsChangeDataConfig = {div: '#main4', width: 500, height: 500, top: 60, left: 120, bottom: 100, right: 60};
let barplotsChangeDataClass = new BarplotsChangeDataClass(barplotsChangeDataConfig);

async function main() {
  let scatterplotsConfig1 = {div: '#main1', dataSelector: 1, width: 500, height: 500, top: 60, left: 80, bottom: 100, right: 60};
  
  let scatterplotsGraph1 = new ScatterplotsClass(scatterplotsConfig1);
  await scatterplotsGraph1.loadCSV('../data/brazil_rent_data.csv');
  
  scatterplotsGraph1.createScales();
  scatterplotsGraph1.createAxis();
  scatterplotsGraph1.renderCircles();

  // ------------------

  let scatterplotsConfig2 = {div: '#main2', dataSelector: 2, width: 500, height: 500, top: 60, left: 80, bottom: 100, right: 60};
  
  let scatterplotsGraph2 = new ScatterplotsClass(scatterplotsConfig2);
  await scatterplotsGraph2.loadCSV('../data/brazil_rent_data.csv');
  
  scatterplotsGraph2.createScales();
  scatterplotsGraph2.createAxis();
  scatterplotsGraph2.renderCircles();

  // ------------------

  let barplotsConfig = {div: '#main3', width: 500, height: 500, top: 60, left: 120, bottom: 100, right: 60};
  
  let barplotsClass = new BarplotsClass(barplotsConfig);
  await barplotsClass.loadCSV('../data/brazil_rent_data.csv');

  barplotsClass.createScales();
  barplotsClass.createAxis();
  barplotsClass.renderBars();
  barplotsClass.renderAnimationOnLoading()

  // ------------------

  await barplotsChangeDataClass.loadCSV('../data/brazil_rent_data.csv');

  barplotsChangeDataClass.createScales();
  barplotsChangeDataClass.createAxis();
  barplotsChangeDataClass.renderBars(1);

  // ------------------

  let lineplotsConfig = {div: '#main5', width: 500, height: 500, top: 60, left: 120, bottom: 100, right: 60};
  
  let lineplotsClass = new LineplotsClass(lineplotsConfig);
  await lineplotsClass.loadCSV('../data/brazil_forest_fire_report_data.csv');

  lineplotsClass.createScales();
  lineplotsClass.createAxis();
  lineplotsClass.renderLines();
}

main();

function update(dataSelector) {
  console.log("infelizmente a mudança do dataset não aconteceu :(")
  barplotsChangeDataClass.renderBars(dataSelector);
}