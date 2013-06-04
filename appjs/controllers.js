App.controller('Ctrl', function ($scope, $http, $timeout){
  $scope.loginUsername = "";
  $scope.loginPassword = "";
  $scope.userName="";
  $scope.userSurname="";
  $scope.loggedIn = false;
  $scope.userId = 0;
  $scope.apiKey = "Ix7evhXTw3uwk1gDHCvzz-uMNEhOy8ZN";

  //Summary
  $scope.typeDistributions = [];
  $scope.pickedDate = null;
  $scope.dailyResults = [];
  $scope.resultsDisplayed = false;

  //RealTime
  $scope.realTimeActive = false;
  $scope.realTimeResult = "Not activated";
  $scope.realTimeResultAge = null;

  //Page switching
  $scope.resultsVisible = true;
  $scope.summaryVisible = false;
  $scope.realtimeVisible = false;


  $scope.goToResults = function(){
    $scope.resultsVisible = true;
    $scope.summaryVisible = false;
    $scope.realtimeVisible = false;
  };

  $scope.goToSummary = function(){
   $scope.resultsVisible = false;
   $scope.summaryVisible = true;
   $scope.realtimeVisible = false;
 };

 $scope.goToRealtime = function(){
  $scope.resultsVisible = false;
  $scope.summaryVisible = false;
  $scope.realtimeVisible = true;
};


$scope.logOut = function(){
  // alert("ping");
  $scope.loggedIn=false;
  $scope.userName='';
  $scope.userSurname='';
  $scope.userId='';
};

$scope.logIn = function() {
  var url = "https://api.mongolab.com/api/1/databases/activity_recognition/collections/users?q={%22username%22:%20%22" + $scope.loginUsername + "%22,%22password%22:%22" + $scope.loginPassword + "%22}&apiKey=" + $scope.apiKey;
  $http.get(url).success(
    function(data, status, headers, config) {
      if(data.length==1){
        var user = data[0];
        $scope.loggedIn=true;
        $scope.userName=user.name;
        $scope.userSurname=user.surname;
        $scope.userId=user.userid;
        $scope.loadResults();
        $scope.loginUsername='';
        $scope.loginPassword='';
      }
    }
    );
};

$scope.results = [
  // {date: "May 31, 2013 5:51:45 PM",
  // p: [
  // -848.5727069759712,
  // -280.8045515994242,
  // -30.86754679639256,
  // -75.21763730225379,
  // 0,
  // 0
  // ],
  // result: 2
  // }
  ];

  $scope.loadRealTimeResult = function(){
    $scope.realTimeTickCounter=$scope.realTimeTickCounter+1;
    var type;
    var value = $scope.realTimeTickCounter;
    $scope.dynamic = (value);
    if(($scope.realTimeTickCounter % 100)===0){
      var url= "https://api.mongolab.com/api/1/databases/activity_recognition/collections/classification_results?q={%22userid%22:%20"+$scope.userId+"}&s={%22_id%22:%20-1}&l=1&f={%22result%22:%201,%22date%22:%201}&apiKey="+$scope.apiKey;
      // var url= "https://api.mongolab.com/api/1/databases/activity_recognition/collections/classification_results?s={%22date%22:%201}&l=1&apiKey="+$scope.apiKey;
      $http.get(url).success(
        function(data, status, headers, config) {
          if(data.length==1){
            var newest = data[0];
            var ageinms=Math.abs(new Date() - dates.convert(newest.date));
            // alert(ageinms + " age: "+ $scope.msToTime(ageinms) + "date" + newest.date);
            if(ageinms<60000){//1 minute cutoff
              $scope.realTimeResultAge=$scope.msToTime(ageinms);
              $scope.realTimeResult=$scope.typeToString(newest.result);
              $scope.realTimeTimestamp=newest.date;
            }else{
              $scope.realTimeResult="No broadcast detected";
              $scope.realTimeResultAge="no broadcast";
            }

          }
        }
        );
      $scope.realTimeTickCounter=0;
    }
    mytimeout = $timeout($scope.loadRealTimeResult,30);
  };

  var mytimeout = null;
  $scope.realTimeTickCounter=0;

  $scope.toggleRealTime = function(){
    if($scope.realTimeActive===true){
      $scope.realTimeActive=false;
      $timeout.cancel(mytimeout);
    }else{
      $scope.realTimeActive=true;
      $scope.realTimeResult="Connecting...";
      mytimeout = $timeout($scope.loadRealTimeResult,30);
    }
  };

  $scope.countToTime = function(d) {
    var h, m, s;
    d = d * 3.25; //12.8 seconds full sample size, every 6.4 classification is performed.
    d = Number(d) || 0;
    h = Math.floor(d / 3600);
    m = Math.floor(d % 3600 / 60);
    s = Math.floor(d % 3600 % 60);
    return (h > 0 ? h + ":" : "") + (m > 0 ? (m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s;
  };

  $scope.msToTime = function(d) {
    var h, m, s;
    d = d / 1000; //12.8 seconds full sample size, every 6.4 classification is performed.
    d = Number(d) || 0;
    h = Math.floor(d / 3600);
    m = Math.floor(d % 3600 / 60);
    s = Math.floor(d % 3600 % 60);
    return (h > 0 ? h + ":" : "") + (m > 0 ? (m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s;
  };


  $scope.toggleText = function(){
    if($scope.realTimeActive===true){
      return "Stop";
    }else{
      return "Start";
    }
  };

  $scope.calculateDailyTypeDistribution = function (){
    var dailyResultsArray=[];
    for (var i = 0; i < $scope.results.length; i++) {
      if(dates.compareDays($scope.results[i].date,$scope.pickedDate)===0){
        dailyResultsArray.push($scope.results[i]);
      }
    }
    var tempTypeDistribution = [];
    for (var j = 0; j < 7; j++) {
      tempTypeDistribution.push($scope.typeCount(j,dailyResultsArray));
    }
    $scope.typeDistribution=tempTypeDistribution;
    var sum = 0;
    for(var k=0;k<tempTypeDistribution.length;k++){
      sum = sum + tempTypeDistribution[k];
    }
    if(sum>0){
      $scope.resultsDisplayed=true;
    }else{
      $scope.resultsDisplayed=false;
    }
  };


  $scope.updateDateFunction = function (date){
    $scope.pickedDate = date;
    $scope.calculateDailyTypeDistribution();
  };

  $scope.loadResults = function() {
    var url = "https://api.mongolab.com/api/1/databases/activity_recognition/collections/classification_results?q={%22userid%22:"+$scope.userId+ "}&apiKey=" + $scope.apiKey;
    $http.get(url).success(
      function(data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
          $scope.results.push({date: data[i].date, p: data[i].p, result: data[i].result});
        }
      }

      );
  };

  $scope.typeCount = function(type,array){
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      if(array[i].result==type){
        count++;
      }
    }
    return count;
  };

  $scope.typeToString = function(type){
    switch (type) {
      case 0:
      return "Walking (0)";
      case 1:
      return "Fast Walking (1)";
      case 2:
      return "Walking up the stairs (2)";
      case 3:
      return "Walking down the stairs (3)";
      case 4:
      return "Sitting (4)";
      case 5:
      return "Standing up (5)";
      case 6:
      return "Jumping (6)";
      case 7:
      return "Test: Wave Sideways (7)";
      case 8:
      return "Test: Wave Forward (8)";
      case 9:
      return "Test: Unidentified (9)";
      default:
      return "Unspecified";

    }
  };

  $scope.totalTypeCount = function(type){
    var count = 0;
    for (var i = 0; i < $scope.results.length; i++) {
      if($scope.results[i].result==type){
        count++;
      }
    }
    return count;
  };


  $scope.todos = [{text:'Learn AngularJS', done: false},{text: 'Build an app', done: false}];

  $scope.totalTodos = $scope.todos.length;


  $scope.getTotalTodos = function() {
    return $scope.todos.length;
  };

  $scope.addTodo = function() {
    $scope.todos.push({text:$scope.formTodoText, done: false});
    $scope.formTodoText='';
  };

  $scope.clearCompleted = function(){
    $scope.todos = _.filter($scope.todos, function(todo){
      return !todo.done;
    });
  };



/*

DATE MANIPULATION UTILITY FUNCTIONS

*/
var dates = {
          convert:function(d) {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp)
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            return (
              d.constructor === Date ? d :
              d.constructor === Array ? new Date(d[0],d[1],d[2]) :
              d.constructor === Number ? new Date(d) :
              d.constructor === String ? new Date(d) :
              typeof d === "object" ? new Date(d.year,d.month,d.date) :
              NaN
              );
          },
          convertDays:function(d) {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp)
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            return (
              d.constructor === Date ? d.setHours(0,0,0,0) :
              d.constructor === Array ? new Date(d[0],d[1],d[2]).setHours(0,0,0,0) :
              d.constructor === Number ? new Date(d).setHours(0,0,0,0) :
              d.constructor === String ? new Date(d).setHours(0,0,0,0) :
              typeof d === "object" ? new Date(d.year,d.month,d.date).setHours(0,0,0,0) :
              NaN
              );
          },
          compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
          isFinite(a=this.convert(a).valueOf()) &&
          isFinite(b=this.convert(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
          );
      },
      compareDays:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
          isFinite(a=this.convertDays(a).valueOf()) &&
          isFinite(b=this.convertDays(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
          );
      },
      inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
          isFinite(d=this.convert(d).valueOf()) &&
          isFinite(start=this.convert(start).valueOf()) &&
          isFinite(end=this.convert(end).valueOf()) ?
          start <= d && d <= end :
          NaN
          );
      }
    };



  });