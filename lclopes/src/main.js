import { Scatterplot } from './scatterplot.js'
import { Lineplot } from './lineplot.js'
import { Barplot } from './barplot.js'

async function main() {
  //creating scatterplot
  let c1 = {div: '#scatterplot', width: 1000, height: 500, top: 30, left: 70, bottom: 100, right: 30};
  let scatterplot = new Scatterplot(c1);
  await scatterplot.loadCSV('../data/hdi.csv');
  
  scatterplot.createScales();
  scatterplot.createAxis();
  scatterplot.renderCircles();

  //creating lineplot
  let c2 = {div: '#lineplot1', width: 500, height: 500, top: 10, left: 130, bottom: 60, right: 60};
  let lineplot1 = new Lineplot(c2);
  await lineplot1.loadCSV('../data/co2_emission.csv', 'United States');

  lineplot1.createScales();
  lineplot1.createAxis();
  lineplot1.renderLines();

  //creating lineplot
  let c3 = {div: '#lineplot2', width: 500, height: 500, top: 10, left: 130, bottom: 60, right: 60};
  let lineplot2 = new Lineplot(c3);
  await lineplot2.loadCSV('../data/co2_emission.csv', 'China');

  lineplot2.createScales();
  lineplot2.createAxis();
  lineplot2.renderLines();

  //creating barplot
  let c4 = {div: '#barplot', width: 500, height: 500, top: 60, left: 130, bottom: 100, right: 60};
  let barplot = new Barplot(c4);
  await barplot.loadCSV('../data/co2_emission.csv');

  barplot.createScales();
  barplot.createAxis();
  barplot.renderBars();
  barplot.renderAnimationOnLoading()
}

main();