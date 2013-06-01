function Ctrl($scope){

  $scope.loginUsername = "";
  $scope.loginPassword = "";
  $scope.userName="";
  $scope.userSurname="";
  $scope.loggedIn = false;
  $scope.userId = 0;
  $scope.apiKey = "Ix7evhXTw3uwk1gDHCvzz-uMNEhOy8ZN";

  $scope.logIn = function() {
    // alert("called");
    $.ajax( {
     url: "https://api.mongolab.com/api/1/databases/activity_recognition/collections/users?q={%22username%22:%20%22" + $scope.loginUsername + "%22,%22password%22:%22" + $scope.loginPassword + "%22}&apiKey=" + $scope.apiKey,
     type: "GET",
     // dataType: 'json',
     contentType: "application/json",
     success: function(data){
       if(data.length==1){
         var user = data[0];
         $scope.loggedIn=true;
         $scope.userName=user.name;
         $scope.userSurname=user.surname;
         $scope.userId=user.userid;
       }
     }
   }
   );
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