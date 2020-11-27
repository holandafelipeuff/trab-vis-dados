const d3 = window.d3;

export class Scatterplot {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

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

  async loadCSV(file) {

    this.circles = await d3.csv(file, d => {
      var datetime = new Date(d.data_inversa + d.horario);
      
      var ms = datetime.getTime();
      return {
        cx: +d.km,
        cy: +d.pessoas,
        //col: +d.mortos,
        cat: d.tipo_acidente,
        r: 5
      }
    
    });


  }

  createScales() {
    let xExtent = d3.extent(this.circles, d => {
      return d.cx;
    });
    let yExtent = d3.extent(this.circles, d => {
      return d.cy;
    });
    let colExtent = d3.extent(this.circles, d => {
      return d.col;
    });

    const cats = this.circles.map(d => {
      return d.cat;
    });
    let catExtent = d3.union(cats);

    this.xScale = d3.scaleLinear().domain(xExtent).nice().range([0, this.config.width]);
    this.yScale = d3.scaleLinear().domain(yExtent).nice().range([this.config.height, 0]);

    //this.colScale = d3.scaleSequential(d3.interpolateRgb("red", "blue")).domain(colExtent);
    this.catScale = d3.scaleOrdinal().domain(catExtent).range(d3.schemeTableau10);
  }

  createAxis() {
    let xAxis = d3.axisBottom(this.xScale)
      .ticks(10);

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
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("x", -150)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Pessoas envolvidas no acidente");

    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.config.width/2 + 100) + " ," + 
                           (this.config.height + this.config.top + 40)  + ")")
      .style("text-anchor", "middle")
      .text("Quilômetro");

    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.config.width/2 + 100) + " ," + 
                           (this.config.height + this.config.top + 60) + ")")
      .style("text-anchor", "middle")
      .text("Cores = tipo de acidente");
  }

  renderCircles() {
    this.margins.selectAll('circle')
      .data(this.circles)
      .join('circle')
      .attr('cx', d => this.xScale(d.cx))
      .attr('cy', d => this.yScale(d.cy))
      .attr('r' , d => d.r)
      //.attr('fill', d => this.colScale(d.col));
      .attr('fill', d => this.catScale(d.cat));
  }
}
