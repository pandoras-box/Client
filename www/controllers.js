angular.module('pandoras-box.controllers', ['ngCordovaOauth', 'btford.socket-io', 'LocalStorageModule'])

.factory('mySocket', function (socketFactory) {
  // var myIoSocket = io.connect('http://localhost:3000');
  //
  // mySocket = socketFactory({
  //   ioSocket: myIoSocket
  // });
  //
  // return mySocket;
})

.controller('IndexCtrl', function(Tasks) {
    const vm = this;
    vm.$onInit = function() {

    }
})

.controller('LandingCtrl', function($state, Tasks) {
    const vm = this;
    vm.$onInit = function() {
      // mySocket.emit('authorizeLoggedIn', emitObject);
    }
    vm.parentContinue = function() {
        $state.go('oauth')

    }

    vm.childContinue = function() {
        $state.go('oauth')
    }
})

.controller('OauthCtrl', function($state, $cordovaOauth, $http, Tasks, LocalStorage) {
    const vm = this;

    vm.$onInit = function() {
    }

    vm.signInGitHub = function() {
        $state.go('tab.dash')
        console.log("Signing in to github!")
    }

    vm.signInFacebook = function() {
        $cordovaOauth.facebook("1792310427755562", ["email","public_profile"], {redirect_uri: "http://localhost/callback"})
        .then((result)=>{
          return Tasks.postAuth(result.access_token);
        })
        .then((result) =>{
            const jwt = result.jwt;
            LocalStorage.setToken(jwt);
            $state.go('tab.dash');
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

  vm.tasks = Tasks.all();

  vm.remove = function(task) {
    Tasks.remove(task);
  };

  // vm.goToList = function() {
  //   console.log('clicked');
  //   $state.go('tab.addTasks')
  // }


  vm.submitEventDetails = function() {
    vm.selected = vm.categories[0];
    $state.go('tab.dash')
  }
})

.controller('TaskDetailCtrl', function(Tasks) {
  const vm = this;

  vm.$onInit = function() {
//TODO:  --> use token
      vm.parentView = false;
      vm.childView = true;
//TODO: query db for this task in a service
      console.log("Made it to task detail!");
  }
  // vm.task = Tasks.get($stateParams.taskId);
  // console.log(vm.task);
})

    // account tab
    .controller('AccountCtrl', function(Tasks) {
      const vm = this;
        vm.createTask = function() {
            vm.createTaskPrompt = false;
            console.log(vm.createTaskPrompt);
        }

        vm.addTask = function(Tasks) {
            console.log('add task');

        }
    })
