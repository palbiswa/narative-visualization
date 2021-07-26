async function drawChart(type){
    
    var casesData;
    var drawBar;
    var catagory;
    if(type == "case"){        
        casesData = await d3.csv("/covid-19-cases-usa-by-state.csv");
        drawBar = "#drawCaseBar";
        catagory = "Avg";
    } else if (type == "death"){
        casesData = await d3.csv("/covid-19-deaths-usa-by-state.csv");
        drawBar = "#drawDeathBar";
        catagory = "Avg";
    } else {
        casesData = await d3.csv("/current-usa-July-20-2021-vaccinated.csv");
        drawBar = "#drawVaccinationBar";
        catagory = type; 
    }    
    
    // Set Dimension
    var margin = {top: 30, right: 120, bottom: 100, left: 70},
    width = 1000 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom; 
    
    // set tooldip div
    var tooltip = d3.select("body").append("div").attr("class", "toolTip"); 

    // Set svg
    var svg = d3.select(drawBar)
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
    y.domain([0, d3.max(casesData, function(d) { return +d[catagory] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    //map data to bar    
    var caseBar = svg.selectAll("rect").data(casesData);    

    var maxCount = d3.max(casesData, function(d) { return +d[catagory] }) ; 
    
    // second Max
    var secondMax = await calculateSecondMax(casesData,catagory);

    // append data
    if(catagory === 'Avg'){
        caseBar.enter()
      .append("rect")
      .merge(caseBar)      
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d[catagory]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[catagory]); })
        .attr("fill",function(d){
            if(d['Avg'] == maxCount){
                return "#404D92" ;
            }else {
                return "#19beca" ;  
            }
        });  
    }
    else {
        caseBar.enter()
      .append("rect") 
      .on("mousemove", function(d){                      
            tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")          
            .html("State :" + d.State +
            "<br> Population :" + numberWithCommas(d.Population) + 
            "<br>" +  type + ": "+ numberWithCommas(d[catagory]))           
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
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d[catagory]); })        
        .attr("width", x.bandwidth())
        .attr("fill",function(d){
            if(d[type] == maxCount){
                return "#404D92" ;
            }else {
                return "#19beca" ;  
            }
        })
        .attr("height", function(d) { return height - y(d[catagory]); }); 
    } 
    
    // annotation       
    caseBar.enter()
        .append("text")        
        .transition()
        .duration(1000)
        .text(function(d) {            
            if(d[catagory] == maxCount){
                return "↓ Highest is " + d.State + " with value :" + numberWithCommas(d[catagory]);            
            }else if(d[catagory] == secondMax){
                return "↓ Second is " + d.State + " with value :" + numberWithCommas(d[catagory]);            
            }            
        })
        .attr("x", function(d) { return x(d.State); })
        .attr("y", function(d) { return y(d[catagory])-10; })
        .attr("font-family" , "sans-serif")        
        .attr("font-size" , "12px")
        .attr("fill" , "red")
        .style("text-anchor", "start");

}



