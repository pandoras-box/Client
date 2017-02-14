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

.controller('OauthCtrl', function($state, $cordovaOauth, $http, Tasks) {
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
        console.log("Signing in to Facebook!")
        $cordovaOauth.facebook("1792310427755562", ["email","public_profile"], {redirect_uri: "http://localhost/callback"})
        .then((result)=>{
          return Tasks.postAuth(result.access_token);
            //Dillon to put POST to server here with this body:
            // result.access_token

        })
        .then((result) =>{
          if(result){
            $state.go('tab.dash');
          }
          else{
            $state.go('landing');
          }

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

.controller('TaskDashCtrl', function(Tasks, $state) {

  const vm = this;
  vm.$onInit = function() {
    Tasks.getActiveTasks()
    .then((tasks)=>{
      console.log(tasks.data.length);
      if (tasks.data.length === 0) {
        vm.createTaskPrompt = true;
        console.log('no tasks');
      } else {
        vm.createTaskPrompt = false;
        vm.tasks = tasks.data;
        console.log('user has tasks', tasks.data);
        console.log(vm.tasks);
      }
    })

  }

    vm.seeDetail = function(task) {
        $state.go('tab.task-detail', {taskId: task.id})
        console.log(task.id);
    }

    vm.completeTaskList = function() {
        console.log('tasks completed');
    }


    vm.createTask = function() {
        vm.createTaskPrompt = false;
        // $state.go('tab.dash')
    }

    vm.addTask = function() {
        console.log('add task');
    }
})

// addtask tab
.controller('AddTasksCtrl', function(Tasks, $state) {
  const vm = this;

  vm.$onInit = function() {
    vm.categories = ['Bathroom', 'Bedroom', 'Kitchen', 'Outdoors'];
  }

  vm.submitEventDetails = function() {
    vm.selected = vm.categories[0];
    $state.go('tab.dash')
  }
})

.controller('TaskDetailCtrl', function() {
  const vm = this;

  vm.$onInit = function() {
      console.log("Made it to task detail!");
  }
  // vm.task = Tasks.get($stateParams.taskId);
  // console.log(vm.task);
})

    // account tab
    .controller('AccountCtrl', function() {
      const vm = this;
        vm.createTask = function() {
            vm.createTaskPrompt = false;
            console.log(vm.createTaskPrompt);
        }

        vm.addTask = function(Tasks) {
            console.log('add task');

        }
    })
