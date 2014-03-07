// jshint -W098
function initApp() {
    if (!window.angular) {
        throw new Error('angular is undefined');
    }
    if (!window.d3) {
        throw new Error('d3 is undefined');
    }

    /* global angular, d3 */
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['PieApp']);

        angular.module('PieApp', [])
        .directive('chartData', function () {
            return {
                controller: function () {}
            };
        })
        .directive('pieChart', function () {
            return {
                restrict: 'EA',
                require: 'chartData',
                scope: {
                    'data': '=chartData',
                    'onClick': '&'
                },
                link: function (scope, element, attrs) {
                    var width = attrs.width || 300;
                    var height = attrs.height || 300;

                    var svg = d3.select(element[0])
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .append('g')
                        .attr('transform', 'translate(' + width/2 + ', ' + height/2 + ')');

                    var color = d3.scale.category10();
                    var arc = d3.svg.arc().outerRadius(120).innerRadius(70);
                    var pie = d3.layout.pie().sort(null);

                    var arcs = svg.selectAll('path')
                        .data(pie(scope.data))
                        .enter()
                        .append('path')
                        .attr({
                            d: arc,
                            fill: function (d, i) { return color(i); },
                            stroke: 'white'
                        })
                        .each(function (d) { this._current = d; });
                    svg.on('mousedown', function (d) {
                        scope.$apply(function () {
                            (scope.onClick || angular.noop)(scope.data, d);
                        });
                    });

                    scope.$watch('data', function (d) {
                        if (!d) {
                            return;
                        }
                        arcs.data(pie(d))
                            .transition()
                            .attrTween('d', arcTween);
                    });

                    function arcTween(a) {
                        var i = d3.interpolate(this._current, a);
                        this._current = i(0);
                        return function (t) {
                            return arc(i(t));
                        };
                    }
                }
            };
        })
        .controller('PieController', function ($scope) {
            var randomData = function (size) {
                return d3.range(size).map(function () {
                    return Math.ceil(Math.random() * 50);
                });
            };
            var count = 5;
            $scope.chartData = randomData(count);
            $scope.changeData = function () {
                $scope.chartData = randomData(count);
            };
        });
    });
}
