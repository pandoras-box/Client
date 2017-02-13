angular.module('pandoras-box.controllers', ['ngCordovaOauth'])

.controller('IndexCtrl', function(Tasks) {
    const vm = this;
    vm.$onInit = function() {

    }
})

.controller('LandingCtrl', function($state, Tasks) {
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

.controller('OauthCtrl', function($state, $cordovaOauth, $http) {
    const vm = this;

    // window.cordovaOauth = $cordovaOauth;
    // window.http = $http;

    vm.$onInit = function() {
        console.log("Initiated!");
    }

    vm.signInGitHub = function() {
        $state.go('tab.dash')
        console.log("Signing in to github!")
    }

    vm.signInFacebook = function() {
        $state.go('tab.dash')
        console.log("Signing in to Facebook!")
        $cordovaOauth.facebook("1792310427755562", ["email","public_profile"], {redirect_uri: "http://localhost/callback"})
        .then((result)=>{
            //Dillon to put POST to server here with this body:
            // result.access_token

        })
        .catch((error)=>{
          console.log(error);
        })

    }
    vm.signInInstagram = function() {
        $state.go('tab.dash')
        console.log("Signing in to Instagram!")
    }

    vm.signInLinkedIn = function() {
        $state.go('tab.dash')
        console.log("Signing in to LinkedIn!")
    }
})

// dash tab
.controller('TaskDashCtrl', function(Tasks) {
    const vm = this;
    vm.$onInit = function() {
        vm.createTaskPrompt = true;
    }
    vm.tasks = Tasks.all();

    vm.completeTaskList = function() {
        console.log('tasks completed');
    }

    vm.createTask = function() {
        // vm.createTaskPrompt = false;
        console.log(vm.createTaskPrompt);
    }

    vm.addTask = function(Tasks) {
        console.log('add task');

    }
})

// task tab
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
        Tasks.remove(task);
    };

    vm.goToList = function() {
        console.log('clicked');
        $state.go('tab-tasks')
    }
})

.controller('TaskDetailCtrl', function($stateParams, Tasks) {
        vm.task = Tasks.get($stateParams.taskId);
    })
    // account tab
    .controller('AccountCtrl', function() {
        const vm = this;
        vm.$onInit = function() {
            vm.showNav = true;
        }
        vm.settings = {
            enableFriends: true
        }
    })
