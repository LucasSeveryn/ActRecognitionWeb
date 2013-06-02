App.directive('chart', function(){
    return{
        restrict: 'E',
        link: function(scope, elem, attrs){
            var data = scope[attrs.ngModel];
            var r = Raphael("pie");
            var pie = null;

            scope.$watch('typeDistribution', function(v){
              if(pie){
                   r.clear();
                   pie.clear();
               }

              r = Raphael("pie"),
              pie = r.piechart(120, 120, 90, v, { legend: [""]});
              pie.hover(function () {
                  this.sector.stop();
                  this.sector.scale(1.1, 1.1, this.cx, this.cy);

                  if (this.label) {
                      this.label[0].stop();
                      this.label[0].attr({ r: 7.5 });
                      this.label[1].attr({ "font-weight": 800 });
                  }
              }, function () {
                  this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

                  if (this.label) {
                      this.label[0].animate({ r: 5 }, 500, "bounce");
                      this.label[1].attr({ "font-weight": 400 });
                  }
              });
            });
        }
    };
});