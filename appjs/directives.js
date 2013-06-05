App.directive('chart', function(){
  return{
    restrict: 'E',
    link: function(scope, elem, attrs){
      var data = scope[attrs.ngModel];
      var r = Raphael("pie");
      var pie = null;


      scope.$watch('topSitter', function(v){
        if(v!==null){
          console.log(v);
          scope.topSitterText = "Winner of sitting category with " +  scope.countToTime2(v.count) + " spent sitting.";
        }
      });

      scope.$watch('topStander', function(v){
        if(v!==null){
          console.log(v);
          scope.topStanderText = "Winner of standing category with " +  scope.countToTime2(v.count) + " spent standing.";
        }
      });

      scope.$watch('typeDistribution', function(v){
        if(pie){
         r.clear();
         pie.clear();
       }
       var sum = 0;
      if(v!=null){
       for(var i=0;i<v.length;i++){
        sum = sum + v[i];
      }
      if(sum>0){
        pie = r.piechart(120, 120, 90, v, { legend: ["%% - Walking (0)", "%% - Fast Walking (1)", "%% - Walking up the stairs (2)", "%% - Walking down the stairs (3)", "%% - Sitting (4)", "%% - Standing (5)", "%% - Jumping (6)"], legendpos: "east" });
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
      }
    }
    }
    );
}
};
});