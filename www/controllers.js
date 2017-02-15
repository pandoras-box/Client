angular.module('pandoras-box.controllers', ['ngCordovaOauth', 'btford.socket-io', 'LocalStorageModule'])


.factory('mySocket', function(socketFactory) {
    const location = null;
    var myIoSocket = io.connect('http://10.6.66.4:5000');

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
})

.controller('IndexCtrl', function(Tasks) {
    const vm = this;
    vm.$onInit = function() {

    }
})


.controller('LandingCtrl', function($state, Tasks, LocalStorage, mySocket) {
    const vm = this;
    vm.$onInit = function() {
        const myToken = LocalStorage.getToken();
        console.log("My token", myToken);
        mySocket.emit('testConnection', {
            hello: "I'm connected!"
        });

    }
    vm.parentContinue = function() {
        Tasks.parentOrChild = 'parent';
        $state.go('oauth')

    }

    vm.childContinue = function() {
        Tasks.parentOrChild = 'child';
        $state.go('oauth')
    }
})

.controller('OauthCtrl', function($state, $cordovaOauth, $http, Tasks, LocalStorage, mySocket) {
    const vm = this;


    vm.$onInit = function() {}

    vm.signInGitHub = function() {
        $state.go('tab.dash')
        console.log("Signing in to github!")
    }

    vm.signInFacebook = function() {
        $cordovaOauth.facebook("1792310427755562", ["email", "public_profile"], {
                redirect_uri: "http://localhost/callback"
            })
            .then((result) => {
                return Tasks.postAuth(result.access_token);
            })
            .then((result) => {
                const jwt = result.data.token;
                LocalStorage.setToken(jwt);
                $state.go('tab.dash');
            })
            .catch((error) => {
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

.controller('TaskDashCtrl', function(Tasks, $state, LocalStorage) {

    const vm = this;

    vm.$onInit = function() {

        const myToken = LocalStorage.getToken();

        //TODO:  --> use token
        vm.parentView = true;
        // <--
        Tasks.getActiveTasks(myToken)
            .then((result) => {
                const authorized = result.data.authorized;
                if (authorized) {
                  const user = result.data.user;
                  const tasks = user.tasks;
                    if (tasks.length === 0) {
                        vm.createTaskPrompt = true;

                        // console.log('no tasks');
                    } else {
                        vm.createTaskPrompt = false;
                        vm.tasks = tasks;
                        // console.log('user has tasks', tasks.data);
                        // console.log(vm.tasks);
                    }
                } else {
                  $state.go('landing');
                }

            })

    }

    vm.seeDetail = function(task) {
        $state.go('tab.task-detail', {
            taskId: task.id
        })
        console.log(task.id);
    }

    vm.completeTaskList = function() {
        console.log('tasks completed');
    }


    vm.createTask = function() {
        vm.createTaskPrompt = false;
        // $state.go('tab.dash')
    }

    // vm.addTask = function() {
    //     console.log('add task');
    // }
})

// addtask tab
.controller('AddTasksCtrl', function(Tasks, $state) {
    const vm = this;
    vm.tasks = Tasks.all();


    vm.$onInit = function() {
        Tasks.getActiveTasks()
            .then(function(tasks) {
                vm.tasks = tasks.data;
                vm.selected = vm.tasks[0];
            })
    }

    // vm.remove = function(task) {
    //     Tasks.remove(task);
    // };

    // vm.goToList = function() {
    //   console.log('clicked');
    //   $state.go('tab.addTasks')
    // }
    vm.getCategory = function() {
        return vm.selected;
    }

    vm.submitEventDetails = function() {
        // TODO: use service to post batch_event description and task category
        $state.go('tab.dash')
        console.log(vm.selected);
        return vm.selected;
    }
})



.controller('TaskDetailCtrl', function(Tasks, LocalStorage, mySocket) {
    const vm = this;

    vm.$onInit = function() {
            //TODO:  --> use token
            vm.parentView = true;
            // vm.childView = false;
            //TODO: query db for this task in a service
        }
        // vm.task = Tasks.get($stateParams.taskId);
        // console.log(vm.task);

    vm.taskAccepted = function(answer) {
        const myToken = LocalStorage.getToken();
        const updateObject = {
            token: myToken,
            task: (vm.task || "Placeholder"),
            accepted: answer
        }
        mySocket.emit('updateTaskApproval', updateObject);
    }

})



// account tab
.controller('AccountCtrl', function(Tasks, mySocket) {
    const vm = this;
    vm.$onInit = function() {
        vm.showUpdateEmail = false;

        // TODO: update variables with token
        vm.parentView = true;
        // vm.parentView = false;
        // vm.childView = true;
        // vm.childEmail = true;
        vm.childEmail = false;
    }

    vm.updateEmail = function() {
        vm.childEmail = true;
        vm.showUpdateEmail = false;
        console.log('submit update email ');
        // send child email to server
        // .then() => get back parent_child id
        // this id will be used to create the socket room for the parent and child
        const returnedID = 1;
        mySocket.emit('create', returnedID);
    }


      vm.logOut = function() {
      LocalStorage.removeToken();
      $state.go('landing');

    }

    vm.toggleUpdateEmail = function() {
        vm.showUpdateEmail = !vm.showUpdateEmail;
    }
})
