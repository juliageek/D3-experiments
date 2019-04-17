var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json("contribution-ratings-mock-data.json", function(data) {
    var x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, 200])
        .range([ height, 0])
        .nice();
    svg.append("g")
        .call(d3.axisLeft(y));

    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    var mouseover = function(d) {
        tooltip
            .style("opacity", 1)
    };

    var mousemove = function(d) {
        tooltip
            .html("Sciskill value: " + d.sciskill_value + "<br> Action score: " + d.action_score)
            .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    };

    var mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
    };

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text("Contribution value");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height/2 + 20)
        .text("Sciskill value");

    svg.append('g')
        .selectAll("dot")
        .data(data.others)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.action_score); } )
        .attr("cy", function (d) { return y(d.sciskill_value); } )
        .attr("r", 12)
        .style('fill', function(d) {
            if (d.action_score <= 0.33) {
                return "#F8766D";
            } else if (d.action_score > 0.33 && d.action_score <= 0.66) {
                return "#FEE333";
            } else {
                return "#57CF8C";
            }
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
});