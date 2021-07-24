async function drawVaccination(type){
    //console.log("drawCases" + type);       
    //const  casesData =  await d3.csv('https://github.com/palbiswa/narative-visualization/blob/main/covid-19-cases-usa-by-state.csv');
    
    var casesData = await d3.csv("/current-usa-July-20-2021-vaccinated.csv"); 
    
    // Set Dimension
    var margin = {top: 30, right: 120, bottom: 100, left: 70},
    width = 1000 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom; 
    
    // set tooldip div
    var tooltip = d3.select("body").append("div").attr("class", "toolTip"); 

    // Set svg
    var svg = d3.select("#drawVaccinationBar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the X axis
    var x = d3.scaleBand().range([ 0, width ]).padding(0.2);

    var xAxis = svg.append("g").attr("transform", "translate(0," + height + ")");     
    
    // Initialize the Y axis
    var y = d3.scaleLinear().range([ height, 0]);

    var yAxis = svg.append("g").attr("class", "myYaxis");

    // X axis
    x.domain(casesData.map(function(d) { return d.State; }));
    xAxis.transition().duration(1000).call(d3.axisBottom(x)).selectAll("text")    
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.2em")
    .attr("transform", "rotate(-90)");

    // Add Y axis
    y.domain([0, d3.max(casesData, function(d) { return +d[type] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    //map data to bar    
    var caseBar = svg.selectAll("rect").data(casesData);    

    var maxCount = d3.max(casesData, function(d) { return +d[type] }) ; 
    
    // second Max
    var secondMax = await calculateSecondMax(casesData,type);
      
    
    caseBar.enter()
      .append("rect") 
      .on("mousemove", function(d){
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")          
          .html("State :" + d.State +
          "<br> Population :" + numberWithCommas(d.Population) + 
          "<br>" +  type + ": "+ numberWithCommas(d[type]))           
          d3.select(this).attr('fill', '#065B11');
        })      
      .on("mouseout", function(d){ tooltip.style("display", "none");
        d3.select(this).transition().duration(250)
        .attr("fill",function(d){
            if(d[type] == maxCount){
                return "#404D92" ;
            }else {
                return "#19beca" ;  
            }
        })
      })     
      //.transition()
      //.duration(0)
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d[type]); })        
        .attr("width", x.bandwidth())
        .attr("fill",function(d){
            if(d[type] == maxCount){
                return "#404D92" ;
            }else {
                return "#19beca" ;  
            }
        })
        .attr("height", function(d) { return height - y(d[type]); });     
    
    // annotation       
    caseBar.enter()
        .append("text")        
        .transition()
        .duration(1000)
        .text(function(d) {            
            if(d[type] == maxCount){
                return "↓ Highest is " + d.State + " with value :" + numberWithCommas(d[type]);            
            }else if(d[type] == secondMax){
                return "↓ Second is " + d.State + " with value :" + numberWithCommas(d[type]);            
            }            
        })
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d[type])-10; })
        .attr("font-family" , "sans-serif")        
        .attr("font-size" , "12px")
        .attr("fill" , "red")
        .style("text-anchor", "start");

}



