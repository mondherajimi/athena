<?
$idPage = 133;


    ?>
	
 <!doctype html>
<html>
<head>

<title>HISTOGRAM AngularJS</title>
 
<script type="text/javascript" src="js/prototype.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular.min.js"></script>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="js/barGraphProto.js"></script>
<script src="js/angulard3bargraph.js"></script>

<!--<link rel="stylesheet" href="css/style.css">-->
</head>
<body ng-app="graph">
<div id="d3bar" angulard3-bar-graph datajson="'sample.json'"
                    xaxis-name = "'Year'"
                    xaxis-pos = "'905'"
                    yaxis-name = "'Frequency'"
                    yaxis-pos = "12"
                    d3-format= "'.0%'">
<!-- angular directive is angulard3-bar-graph -->
<!-- directive variables are xaxis-name,yaxis-name,xaxis-pos,yaxis-pos,y axis data format(d3-format)
and finally the datajson variable which is holding the external data source -->
</div>

<script>
angular.module('AngularD3BarGraph', []) // Angular Module Name
     .directive('angulard3BarGraph', function () { // Angular Directive
          return {
             restrict: 'A',
          scope: {
             datajson: '=',
             xaxisName: '=',
             xaxisPos: '=',
             yaxisName: '=',
             yaxisPos: '=',
             d3Format: '='
             // All the Angular Directive Vaiables used as d3.js parameters
                              },
          link: function (scope, elem, attrs) {
                var ourGraph = new BarGraph(scope.datajson,scope.xaxisName,scope.xaxisPos,scope.yaxisName,scope.yaxisPos,scope.d3Format);
                //d3 related Variable initialisation
                ourGraph.workOnElement('#'+elem[0].id); // Work on particular element
                ourGraph.generateGraph(); // generate the actual bar graph
         } 
     }
});
</script>
</body>
</html>

