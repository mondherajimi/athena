var app = angular.module('graph', []);
/**
 * Beacon performance display controller 
 */
app.controller('graphCtrl', ['$scope',
 function($scope) {

    /* Histogram */ 
    $scope.data = [
        {"name":"amb","nqueries":10},
        {"name":"amp","nqueries":25},
        {"name":"amp2","nqueries":25},
        {"name":"bo2","nqueries":18},
        {"name":"bo3","nqueries":13}]; 


    $scope.changeData = function(){
        $scope.data = [
        {"name":"amb","nqueries":15},
        {"name":"amp","nqueries":30},
        {"name":"amp2","nqueries":25},
        {"name":"bo2","nqueries":18},
        {"name":"bo3","nqueries":13},
        {"name":"bob","nqueries":20},
        {"name":"bob2","nqueries":5},
        {"name":"lamb2","nqueries":10}]; 

    }



}]);


app.directive('histogram', ['$parse', '$window', function($parse, $window){
	return{
		restrict: "E", 
		replace: false,
		template: "<svg class='histogram-chart'></div>",
		link: function(scope, elem, attrs) {
			var exp = $parse(attrs.data);
			var d3 = $window.d3;
            
            
            /*
                Sortable barchart. Largely taken from: 
                http://bl.ocks.org/mbostock/3885705
            */ 

			// Aesthetic settings 
			var margin = {top: 20, right: 50, bottom: 20, left: 50},
			    width = 500 - margin.left - margin.right,
			    height = 400 - margin.top - margin.bottom, 
			    barColor = "steelblue", 
			    axisColor = "whitesmoke", 
			    axisLabelColor = "grey",
			    yText = "Number", 
			    xText = "IDs";

			// Inputs to the d3 graph 
			var data = scope[attrs.data];

			// A formatter for counts.
			var formatCount = d3.format(",.0f");

			// Set the scale, separate the first bar by a bar width from y-axis
			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1, 1);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickFormat(formatCount);

			// Initialize histogram 
			var svg = d3.select(".histogram-chart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			function drawAxis(){

				
				data.forEach(function(d) {
					d.nqueries = +d.nqueries;
				});

				x.domain(data.map(function(d) { return d.name; }));
				y.domain([0, d3.max(data, function(d) { return d.nqueries; })]);

				// Draw x-axis 
				svg.append("g")
					.attr("class", "x-axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.append("text")
					.attr("y", 6)
					.attr("dy", "-0.71em")
					.attr("x", width )
					.style("text-anchor", "end")
					.style("fill", axisLabelColor)
					.text(xText);

				// Draw y-axis 
				svg.append("g")
					.attr("class", "y-axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.style("fill", axisLabelColor)
					.text(yText);

				// Change axis color 
				d3.selectAll("path").attr("fill", axisColor);
			}

			function updateAxis(){

				data.forEach(function(d) {
					d.nqueries = +d.nqueries;
				});

				x.domain(data.map(function(d) { return d.name; }));
				y.domain([0, d3.max(data, function(d) { return d.nqueries; })]);

				svg.selectAll("g.y-axis").call(yAxis);
				svg.selectAll("g.x-axis").call(xAxis);

			}
			
			function updateHistogram(){
                
				// Redefine scale and update axis 
                if (!d3.select('g.y-axis').node()){
                    drawAxis();
                } else {                
                    updateAxis(); 
                }

				// Select 
                var bar = svg.selectAll(".barInfo").data(data);
                
                var bEnter = bar.enter().append("g")
					.attr("class", "barInfo");
                
                bEnter.append("rect")
					.attr("class", "bar");
                
                bEnter.append("text")
                    .attr("class","numberLabel");
                
                // update
                console.log(bar.data());
                
                bar.select("rect")
                    .attr("x", function(d){ return x(d.name) })
					.attr("width", x.rangeBand())
					.attr("y", function(d){ console.log(d); return y(d.nqueries) })
					.attr("height", function(d) { return height - y(d.nqueries); })
					.attr("fill", barColor);
                
                bar.select("text")
                    .attr("y", function(d){ return y(d.nqueries) })
					.attr("x", function(d){ return x(d.name) })
					.attr("dy", "-1px")
					.attr("dx", x.rangeBand()/2 )
					.attr("text-anchor", "middle")
					.attr("class", "numberLabel")
					.text(function(d) { return formatCount(d.nqueries); });               
                    
			}

			// Render the graph when data is changed. 
			scope.$watchCollection(exp, function(newCollection, oldCollection, scope) {
				data = newCollection;
			 	updateHistogram();
			 });

			var sortByVal = false; 
			d3.select(".sortButton").on("click", function(){
				sortByVal = !sortByVal;
				change(sortByVal);
			});

			var sortTimeout = setTimeout(1000);

			function change(sortByVal) {
				clearTimeout(sortTimeout);

				// Copy-on-write since tweens are evaluated after a delay.
				var x0 = x.domain(data.sort(sortByVal
				    ? function(a, b) { return b.nqueries - a.nqueries; }
				    : function(a, b) { return d3.ascending(a.name, b.name); })
				    .map(function(d) { return d.name; }))
				    .copy();

				var transition = svg.transition().duration(750),
				    delay = function(d, i) { return i * 50; };

				transition.selectAll([".bar", ".numberLabel"])
				    .delay(delay)
				    .attr("x", function(d) { return x0(d.name); });

				transition.select(".x-axis")
				    .call(xAxis)
				  .selectAll("g")
				    .delay(delay);
				}

			}
	};
}]);