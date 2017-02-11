angular.module('pandoras-box.controllers', [])

.controller('LandingCtrl', function($state) {
  const vm = this;
  vm.parentContinue = function() {
    $state.go('oauth')
  }

  vm.childContinue = function() {
    $state.go('oauth')
  }
})


.controller('TasksCtrl', function($scope, Tasks) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.tasks = Tasks.all();
  $scope.remove = function(task) {
    Chats.remove(task);
  };
})

.controller('TaskDetailCtrl', function($scope, $stateParams, Tasks) {
  $scope.task = Tasks.get($stateParams.taskId);

})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    }
})


.controller('OauthCtrl', function($state) {
    const vm = this;

    vm.$onInit = function() {
        console.log("Initiated!")
    }

    vm.signInFacebook = function() {
        $state.go('tab.tasks')
        console.log("Signing in to Facebook!")
    }
})
