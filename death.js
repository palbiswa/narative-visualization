async function drawDeath(){
    //console.log("drawCases");   
    //const  casesData =  await d3.csv('https://github.com/palbiswa/narative-visualization/blob/main/covid-19-cases-usa-by-state.csv');
    
    var casesData =  await d3.csv("/narative-visualization/covid-19-deaths-usa-by-state.csv");    
    var casesData= casesData .map(function(d) {
        return {
            State: d.State,
            Avg: d.Avg,         
        }
      });
    //console.log(casesData);    
    
    // Set Dimension
    var margin = {top: 40, right: 80, bottom: 100, left: 70},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;    

    // Set svg
    var svg = d3.select("#drawDeathBar")
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
    y.domain([0, d3.max(casesData, function(d) { return +d['Avg'] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    //map data to bar    
    var caseBar = svg.selectAll("rect").data(casesData);    

    var maxCount = d3.max(casesData, function(d) { return +d['Avg'] }) ;
    // second Max
    var secondMax = await calculateSecondMax(casesData,'Avg');
    
    caseBar.enter()
      .append("rect")
      .merge(caseBar)
      //.transition()
      //.duration(1000)
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d['Avg']); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d['Avg']); })
        .attr("fill",function(d){
            if(d['Avg'] == maxCount){
                return "#404D92" ;
            }else {
                return "#19beca" ;  
            }
        });
    
    caseBar.enter()
        .append("text")
        .merge(caseBar)
        .transition()
        .duration(1000)
        .text(function(d) { 
            if(d['Avg'] == maxCount){
                return "↓ Highest is " + d.State + " with value :" + numberWithCommas(d['Avg']);            
            }else if(d['Avg'] == secondMax){
                return "↓ Second is " + d.State + " with value :" + numberWithCommas(d['Avg']);            
            }             
        })
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d['Avg'])-10; })
        .attr("font-family" , "sans-serif")        
        .attr("font-size" , "12px")
        .attr("fill" , "red")
        .style("text-anchor", "start");

}
