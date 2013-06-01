function Ctrl($scope, $http){

  $scope.loginUsername = "";
  $scope.loginPassword = "";
  $scope.userName="";
  $scope.userSurname="";
  $scope.loggedIn = false;
  $scope.userId = 0;
  $scope.apiKey = "Ix7evhXTw3uwk1gDHCvzz-uMNEhOy8ZN";


  //debug - DELETE FOR PRODUCITON
  // $scope.loginUsername = "";
  // $scope.loginPassword = "";
  // $scope.userName="Lucas";
  // $scope.userSurname="Severyn";
  // $scope.loggedIn = true;
  // $scope.userId = 1337;
  ////////

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
        }
      }
    );
  };

  $scope.results = [
    {date: "May 31, 2013 5:51:45 PM",
    p: [
        -848.5727069759712,
        -280.8045515994242,
        -30.86754679639256,
        -75.21763730225379,
        0,
        0
    ],
    result: 2
    }
  ];

  $scope.loadResults = function() {
    var url = "https://api.mongolab.com/api/1/databases/activity_recognition/collections/classification_results?q={%22userid%22:"+$scope.userId+ "}&apiKey=" + $scope.apiKey;
    $http.get(url).success(
      function(data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
            $scope.results.push({date: data[i].date, p: data[i].p, result: data[i].result});
        }
        // $('#resultsTable').chromatable();
        $('.table-fixed-header').fixedHeader();
      }
    );
  };

  $scope.typeCount = function(type){
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
}