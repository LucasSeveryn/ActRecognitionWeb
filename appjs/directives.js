App.directive('chart', function(){
    return{
        restrict: 'E',
        link: function(scope, elem, attrs){
            var data = scope[attrs.ngModel];

            scope.$watch('typeDistribution', function(v){
                    var r = Raphael("pie");
                    r.piechart(120, 120, 90, [1,2,3]);
            });
        }
    };
});