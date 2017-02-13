angular.module('pandoras-box.controllers', [])
.controller('IndexCtrl', function(Tasks){

  const vm = this;
  vm.$onInit = function() {


  }
})

.controller('LandingCtrl', function($state,Tasks) {
  const vm = this;
  vm.$onInit = function() {

  }
  vm.parentContinue = function() {
    $state.go('oauth')
  }

  vm.childContinue = function() {
    $state.go('oauth')
  }
})


.controller('TasksCtrl', function(Tasks) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  const vm = this;
  vm.$onInit = function() {

  }
  vm.tasks = Tasks.all();
  vm.remove = function(task) {
    Chats.remove(task);
  };

  vm.goToList = function() {
    console.log('clicked');
    $state.go('tab-tasks')
  }
})

.controller('TaskDetailCtrl', function($scope, $stateParams, Tasks) {
  $scope.task = Tasks.get($stateParams.taskId);

})

.controller('AccountCtrl', function() {
    const vm = this;
    vm.$onInit = function() {
      vm.showNav = true;
    }
    vm.settings = {
        enableFriends: true
    }
})


.controller('OauthCtrl', function($state) {
    const vm = this;

    vm.$onInit = function() {
        console.log("Initiated!")
    }

    vm.signInGitHub = function() {
        $state.go('tab-tasks')
        console.log("Signing in to github!")
    }

    vm.signInFacebook = function() {
        $state.go('tab-tasks')
        console.log("Signing in to Facebook!")
    }
    vm.signInInstagram = function() {
        $state.go('tab-tasks')
        console.log("Signing in to Instagram!")
    }
    vm.signInLinkedIn = function() {
        $state.go('tab-tasks')
        console.log("Signing in to LinkedIn!")
    }
})
