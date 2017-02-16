angular.module('pandoras-box.controllers', ['ngCordovaOauth', 'btford.socket-io', 'LocalStorageModule'])


.factory('mySocket', function(socketFactory) {
    const location = null;
    var myIoSocket = io.connect('http://10.6.65.123:5000');

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
        Tasks.validate(myToken)
            .then((response) => {
                const user = response.data;
                if (user.authorized) {
                    if (user.is_paired) {
                        $state.go('tab.dash');
                    } else {
                        $state.go('tab.account');
                    }
                }
            })

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
                return Tasks.getUser(jwt);
            })
            .then((result) => {
              const user = result.data;
              if(user.is_paired){
                $state.go('tab.dash');
              } else{
                $state.go('tab.account');
              }
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
                const user = result.data;
                const authorized = user.authorized;
                if (authorized) {
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
.controller('AddTasksCtrl', function(Tasks, $state, LocalStorage) {
    const vm = this;
    const myToken = LocalStorage.getToken();
    vm.tasks = Tasks.all();
    vm.tempTasks = [];
    vm.submitButton = false;


    vm.$onInit = function() {
        Tasks.getActiveTasks()
            .then(function(tasks) {
                vm.tasks = tasks.data;
                vm.selected = vm.tasks[0];
            })
        Tasks.getEvents(myToken)
            .then((result)=>{
                console.log(result);
                vm.events = result.data.events;
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
        let eventName = vm.events[vm.selected - 1].category;
        vm.tempTasks.push({
          eventID: vm.selected,
          description: vm.eventDetails,
          eventName: eventName
        });
        vm.selected = '';
        vm.eventDetails = '';
        vm.submitButton = true;
    }

    vm.submitBatch = function(){
        Tasks.postBatch(myToken, vm.tempTasks)
          .then((result)=>{
            console.log(result);
            $state.go('tab.dash')
          })
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
.controller('AccountCtrl', function(Tasks, mySocket, LocalStorage, $state) {
    const vm = this;
    const myToken = LocalStorage.getToken();
    vm.$onInit = function() {
        console.log("in the account page")
        vm.child = {};
        Tasks.getAccountPageInfo(myToken)
            .then((result) => {
                const user = result.data;
                console.log(user);
                if (user.authorized) {
                    if (user.is_paired) {
                        if (user.type === "parent") {
                            vm.parent = user;
                            vm.child.email = user.childEmail;
                            vm.parentView = false;
                            vm.childEmail = true;
                        }

                    } else {
                        if (user.type === "parent") {
                            vm.parent = user;
                            vm.parentView = true;
                            vm.childEmail = false;
                            vm.showUpdateEmail = false;
                        } else if (user.type === "child") {
                            vm.parentView = false;
                            vm.childEmail = true;
                        }
                    }
                } else {
                    $state.go('landing');
                }

            })

    }

    vm.updateEmail = function() {
        vm.childEmail = true;
        vm.showUpdateEmail = false;
        const childEmail = vm.child.email;

        Tasks.pairParentChild(myToken, childEmail)
            .then((parentWithAllInfo) => {
                const parentChildID = parentWithAllInfo.parentChildID;
                mySocket.emit('create', parentChildID);

                $state.go('tab.dash');
            })
    }


    vm.logOut = function() {
        LocalStorage.removeToken();
        $state.go('landing');

    }

    vm.toggleUpdateEmail = function() {
        vm.showUpdateEmail = !vm.showUpdateEmail;
    }
})
