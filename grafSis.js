var lineDataSis
var lineFunctionSis
function grafSis(rowData) {

  lineDataSis = [];
  for(var i=0; i<rowData.length; i++){
    if(rowData[i].systolic)
      lineDataSis.push({'x':i, 'y':rowData[i].systolic});
    else
      lineDataSis.push({'x':i, 'y': 0});
  }
  var vis = d3.select("#narisiGrafTlak"),
    WIDTH = $("#graf-tlak").width()-40,
    HEIGHT = 200,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineDataSis, function (d) {
        return d.x;
      }),
      d3.max(lineDataSis, function (d) {
        return d.x;
      })
    ]),

    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 200]),


    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);


  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    //.call(yAxis);

  lineFunctionSis = d3.svg.line()
  .x(function (d) {
    return xRange(d.x);
  })
  .y(function (d) {
    return yRange(d.y);
  })
  .interpolate('cardinal');

vis.append("svg:path")
  .attr("stroke", "#FF3232")
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .transition()
  .duration(1000)
  .attrTween("d", getInterpolationSis);

  for(var i=0; i<lineDataSis.length; i++){
    vis.append("rect")
      .attr("width", 1)
      .attr("height", HEIGHT-20)
      .attr("y", 0)
      .attr("x", xRange(lineDataSis[i].x))
      .attr("fill","grey")
      .attr("opacity", 0.5)
    vis.append("circle")
      .attr("cx",xRange(lineDataSis[i].x))
      .attr("cy",yRange(lineDataSis[i].y))
      .attr("r",0)
      .attr("value", lineDataSis[i].y)
      .attr("opacity", 1)
      .attr("fill", "#9dcfa1")
      .attr("stroke", "#FF3232")
      .attr("stroke-width", 2)
      .on("mouseenter", function(){
        d3.select(this)
          .attr("r", 7)

        var x = Number(d3.select(this).attr("cx"))
        var y = Number(d3.select(this).attr("cy"))
        if(x<WIDTH/2){
          x+=20  
        }
        else 
          x-=20
        tekst.text(Number(d3.select(this).attr("value")))
          .attr("font-family", "'Oswald', sans-serif")
          .attr("font-weight", 700)
          .style("text-anchor", "middle")
          .attr("x",x)
          .attr("y",y-15)
          .attr("opacity",1)
      })
      .on("mouseleave", function(){
        d3.select(this)
          .attr("r", 5)
          tekst.attr("opacity",0)
      })
      .transition()
      .delay(100*i)
      .duration(1000).attr("r", 5)
  }
  var tekst = vis.append("text")
  vis.append("rect")
    .attr("width",WIDTH-50)
    .attr("height", 1)
    .attr("x", 50)
    .attr("y",HEIGHT-20)

}
function getInterpolationSis() {

  var interpolateSis = d3.scale.quantile()
  .domain([0,1])
  .range(d3.range(1, lineDataSis.length + 1));

  return function(t) {
    var interpolatedLine = lineDataSis.slice(0, interpolateSis(t));
    return lineFunctionSis(interpolatedLine);
  }
}