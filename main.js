var margin = {top:10,right:160,bottom:30,left:60},
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
var svg = d3.select("#line-chart")
  .append("svg")
  .attr("width",width + margin.left + margin.right)
  .attr("height",height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);
function rowConverter(d){
  return{
    cause: d.Cause,
    deaths: +d.Deaths,
    year: +d.Year,
  }
}
d3.csv("combined_data.csv",rowConverter).then(function(data){
  var Years = Array.from(new Set(data.map(d=>d.year)));
  var causes = Array.from(new Set(data.map(d => d.cause)));
  var causeTotals = causes.map(cause => ({
    cause: cause,
    totalDeaths: d3.sum(data.filter(d => d.cause === cause), d => d.deaths)
  }));
  // Sort causes based on total deaths in descending order
  causeTotals.sort((a, b) => b.totalDeaths - a.totalDeaths);
  // Select the top 10 causes
  var topCauses = causeTotals.slice(0, 10);

  var colorScale = d3.scaleOrdinal()
    .domain(causes)
    .range(d3.schemeCategory10);
  var x = d3.scaleLinear()
    .domain([d3.min(Years),d3.max(Years)])
    .range([0,width])
  svg.append("g")
    .attr("transform",`translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(Years).tickFormat(d3.format("d")));
  var y = d3.scaleLinear()
    .domain([d3.min(data,d=>d.deaths),d3.max(data,d=>d.deaths)])
    .range([height,0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  var line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.deaths));
  topCauses.forEach(function(cause) {
    var causeData = data.filter(d => d.cause === cause.cause);
    console.log(causeData)
  
  svg.append("path")
    .data([causeData])
    .attr("fill", "none")
    .attr("stroke", colorScale(cause.cause))
    .attr("stroke-width", 2)
    .attr("d", line);
  });
  var legend = svg.selectAll(".legend")
  .data(topCauses.map(d => d.cause))
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", (d, i) => "translate(" + (width + 10) + "," + i * 20 + ")");

legend.append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", colorScale);

legend.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(d => d);
});