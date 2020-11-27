class BarplotsAccidentsByPeriod {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

    this.xExtent = null;
    this.yExtent = null;

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

  groupByDiaSemana(data) {
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

  async loadCSV(file) {
    let data = await d3.csv(file, d => {
      return {
        data_inversa: d.data_inversa,
        dia_semana: d.dia_semana
      }
    });
    this.bars = this.groupByDiaSemana(data);
    //this.bars2 = this.groupByMes(data);
  }

  createScales() {
    this.xExtent = this.bars.map(d => {
      return d.dia_semana;
    });

    this.yExtent = d3.extent(this.bars, d => {
      return d.qtd_acidentes;
    });

    this.xScale = d3.scaleBand().domain(this.xExtent).range([0, this.config.width]);
    this.yScale = d3.scaleLinear().domain(this.yExtent).nice().range([this.config.height, 0]);
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
      .text("Dias da semana");

    this.svg.append("text")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -200)
      .attr("dy", ".90em")
      .attr("transform", "rotate(-90)")
      .text("Quantidade de acidentes");
  }

  renderBars() {
    this.margins.selectAll('rect')
      .data(this.bars)
      .enter()
      .append('rect')
        .attr('x', d => this.xScale(d.dia_semana))
        .attr("width", this.xScale.bandwidth())
        .attr('fill', '#69b3a2')
        .attr("height", d => this.config.height - this.yScale(this.yExtent[0]))
        .attr('y', d => this.yScale(this.yExtent[0]));
  }

  renderAnimationOnLoading() {
    this.margins.selectAll('rect')
      .transition()
      .duration(800)
      .attr("y", d => this.yScale(d.qtd_acidentes))
      .attr("height", d => this.config.height - this.yScale(d.qtd_acidentes))
      .delay((d,i) => {return(i*100)})
  }
}


async function main() {
  let barplotsConfig = {div: '#main1', width: 500, height: 500, top: 100, left: 120, bottom: 100, right: 120};
  
  let barplotsClass = new BarplotsAccidentsByPeriod(barplotsConfig);
  await barplotsClass.loadCSV('../../data/data.csv');

  barplotsClass.createScales();
  barplotsClass.createAxis();
  barplotsClass.renderBars();
  barplotsClass.renderAnimationOnLoading()
}

main();