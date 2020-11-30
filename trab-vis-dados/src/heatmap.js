let margin = {top: 20, right: 25, bottom: 50, left: 40};
  
let width = 450 - margin.left - margin.right;
let height = 450 - margin.top - margin.bottom;

let svg = d3.select("#main2")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
  .attr("text-anchor", "end")
  .attr("y", -40)
  .attr("x", -140)
  .attr("id", "yAxisText")
  .attr("dy", ".90em")
  .attr("transform", "rotate(-90)")
  .text("Km da via");

svg.append("text")
  .attr("text-anchor", "end")
  .attr("y", 405)
  .attr("x", 290)
  .attr("id", "xAxisText")
  .attr("dy", ".90em")
  .text("Número de veículos envolvidos");


d3.csv("../../data/data.csv", function(loadedData) {

  function filterAndParametrizeHeatmapData(heatmapData) {

    let newHeatmapData = []

    heatmapData.forEach(element => {
      if (element.qtd_acidentes <= 2000){
        if (element.qtd_acidentes >= 0 && element.qtd_acidentes < 20) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 1, parametrized_text: '0 a 20 acidentes' })
        } else if (element.qtd_acidentes >= 20 && element.qtd_acidentes < 40) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 2, parametrized_text: '20 a 40 acidentes' })
        } else if (element.qtd_acidentes >= 40 && element.qtd_acidentes < 60) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 3, parametrized_text: '40 a 60 acidentes' })
        } else if (element.qtd_acidentes >= 60 && element.qtd_acidentes < 80) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 4, parametrized_text: '60 a 80 acidentes' })
        } else if (element.qtd_acidentes >= 80 && element.qtd_acidentes < 100) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 5, parametrized_text: '80 a 100 acidentes' })
        } else if (element.qtd_acidentes >= 100 && element.qtd_acidentes < 120) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 6, parametrized_text: '100 a 120 acidentes' })
        } else if (element.qtd_acidentes >= 120 && element.qtd_acidentes < 140) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 7, parametrized_text: '120 a 140 acidentes' })
        } else if (element.qtd_acidentes >= 140 && element.qtd_acidentes < 160) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 8, parametrized_text: '140 a 160 acidentes' })
        } else if (element.qtd_acidentes >= 160 && element.qtd_acidentes < 180) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 9, parametrized_text: '160 a 180 acidentes' })
        } else if (element.qtd_acidentes >= 180 && element.qtd_acidentes < 200) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 10, parametrized_text: '180 a 200 acidentes' })
        } else if (element.qtd_acidentes >= 200 && element.qtd_acidentes < 220) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 11, parametrized_text: '200 a 220 acidentes' })
        } else if (element.qtd_acidentes >= 220 && element.qtd_acidentes < 240) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 12, parametrized_text: '220 a 240 acidentes' })
        } else if (element.qtd_acidentes >= 240 && element.qtd_acidentes < 260) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 13, parametrized_text: '240 a 260 acidentes' })
        } else if (element.qtd_acidentes >= 260 && element.qtd_acidentes < 280) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 14, parametrized_text: '260 a 280 acidentes' })
        } else if (element.qtd_acidentes >= 280 && element.qtd_acidentes < 300) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 15, parametrized_text: '280 a 300 acidentes' })
        } else if (element.qtd_acidentes >= 300 && element.qtd_acidentes < 320) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 16, parametrized_text: '300 a 320 acidentes' })
        } else if (element.qtd_acidentes >= 320 && element.qtd_acidentes < 340) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 17, parametrized_text: '320 a 340 acidentes' })
        } else if (element.qtd_acidentes >= 340 && element.qtd_acidentes < 360) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 18, parametrized_text: '340 a 360 acidentes' })
        } else if (element.qtd_acidentes >= 360 && element.qtd_acidentes < 380) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 19, parametrized_text: '360 a 380 acidentes' })
        } else if (element.qtd_acidentes >= 380 && element.qtd_acidentes < 400) {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 20, parametrized_text: '380 a 400 acidentes' })
        } else {
          newHeatmapData.push({ veiculos: element.veiculos, km: element.km, qtd_acidentes: 21, parametrized_text: 'Acima de 400 acidentes' })
        }
      }
    });

    return newHeatmapData;

  }

  function groupByKmAndVehicle(loadedData) {
    let heatmapData = [];

    loadedData.reduce(function(res, value) {
     
      value.km = Math.round(+value.km - 321);

      if (!res[value.km + "-" + value.veiculos]) {
        res[value.km + "-" + value.veiculos] = { veiculos: value.veiculos, km: value.km, qtd_acidentes: 0 };
        heatmapData.push(res[value.km + "-" + value.veiculos])
      }
      
      res[value.km + "-" + value.veiculos].qtd_acidentes = res[value.km + "-" + value.veiculos].qtd_acidentes + 1;
    
      return res;
    }, {});
    
    return filterAndParametrizeHeatmapData(heatmapData);
  }

  let data = groupByKmAndVehicle(loadedData);

  let tempMyGroups = d3.map(data, function(d){return d.veiculos;}).keys()
  let tempMylets = d3.map(data, function(d){return d.km;}).keys()

  let myGroups = [];
  let mylets = [];

  tempMyGroups.forEach(element => {
    myGroups.push(parseInt(element))
  });

  tempMylets.forEach(element => {
    mylets.push(parseInt(element))
  });

  mylets.sort(function(a, b) {
    return a - b;
  });

  myGroups.sort(function(a, b) {
    return a - b;
  });

  let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  let y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(mylets)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  let myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,21])

  let tooltip = d3.select("#main2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  let mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  let mousemove = function(d) {
    tooltip
      .html("A quantidade de acidentes<br>para esta célula é de: " + d.parametrized_text)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  let mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // Adicionando os quadrados
  svg.selectAll()
    .data(data, function(d) {return d.veiculos+':'+d.km;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.veiculos) })
      .attr("y", function(d) { return y(d.km) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.qtd_acidentes)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})