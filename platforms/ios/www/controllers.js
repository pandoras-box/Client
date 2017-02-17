angular.module('pandoras-box.controllers', ['ngCordovaOauth', 'btford.socket-io', 'LocalStorageModule'])

.factory('mySocket', function(socketFactory) {
    const location = null;

    // var myIoSocket = io.connect('https://pandoras-box-team.herokuapp.com');
    var myIoSocket = io.connect('http://10.6.65.77:5000');



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
                        Tasks.getParentChildID(myToken)
                            .then((result) => {
                                const parentChildID = result.data.id.id;
                                const connectionObject = {
                                        user: user,
                                        roomID: parentChildID
                                    }
                                    // mySocket.emit('room', connectionObject);
                                $state.go('tab.dash');
                            })
                    } else {
                        $state.go('tab.account');
                    }
                }
            })

        console.log("My token", myToken);
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


    vm.signInFacebook = function() {
        let myToken = null;
        $cordovaOauth.facebook("1792310427755562", ["email", "public_profile"], {
                redirect_uri: "http://localhost/callback"
            })
            .then((result) => {
                return Tasks.postAuth(result.access_token);
            })
            .then((result) => {
                myToken = result.data.token;
                LocalStorage.setToken(myToken);
                return Tasks.getUser(myToken);
            })
            .then((result) => {
                const user = result.data;
                if (user.authorized) {
                    if (user.is_paired) {
                        Tasks.getParentChildID(myToken)
                            .then((result) => {
                                const parentChildID = result.data.id.id;
                                const connectionObject = {
                                        user: user,
                                        roomID: parentChildID
                                    }
                                    // mySocket.emit('room', connectionObject);
                                $state.go('tab.dash');
                            })
                    } else {
                        if (user.type === 'parent') {
                            $state.go('tab.account');
                        } else if (user.type === 'child') {
                            $state.go('landing');
                        }
                    }
                } else {
                    $state.go('landing');
                }
            })
            .catch((error) => {
                console.log(error);
            })


    }

})

// dash tab

.controller('TaskDashCtrl', function(Tasks, $state, LocalStorage, mySocket) {

    const vm = this;
    let user;

    // mySocket.on('taskUpdate', function(data) {
    //     console.log('Incoming message:', data);
    // });

    vm.$onInit = function() {
        vm.createTaskPrompt = true;
        const myToken = LocalStorage.getToken();

        Tasks.getActiveTasks(myToken)
            .then((result) => {
                user = result.data;
                console.log(user);
                const authorized = user.authorized;

                if (authorized) {
                    const tasks = user.tasks;
                    if (tasks.length === 0) {
                        vm.createTaskPrompt = true;
                        console.log('no tasks');
                        if (user.type = "parent") {
                            vm.parentView = true;
                        }
                    } else {
                        vm.createTaskPrompt = false;
                        console.log(vm.createTaskPrompt);
                        vm.tasks = tasks;
                        console.log('user has tasks', tasks.data); //undefined
                        console.log(vm.tasks);
                    }
                } else {
                    $state.go('landing');
                }

            })

    }

    vm.goToDetail = function(task) {
        Tasks.specificTask.task = task;
        Tasks.specificTask.user = user;
        $state.go('tab.task-detail');
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

    vm.addTask = function() {
        console.log('add task');
    }

    vm.unlockBox = function() {
        console.log("Unlocking");
        mySocket.emit('unlockBox');
    }
})

.controller('TaskDetailCtrl', function(Tasks, LocalStorage, mySocket) {
    const vm = this;

    vm.$onInit = function() {
            console.log(Tasks.specificTask);
            if (Tasks.specificTask.user.type === 'parent') {
                vm.parentView = true;
                vm.childView = true;
                vm.task = Tasks.specificTask.task;
                console.log(vm.task);
                console.log(vm.task.status);
            } else {
                console.log('child');
                vm.parentView = false;
                vm.childView = true;
            }
            //TODO:  --> use token
            //TODO: query db for this task in a service
        }
        // vm.task = Tasks.get($stateParams.taskId);
        // console.log(vm.task);


    vm.updateTaskStatus = function(newStatus) {
        const myToken = LocalStorage.getToken();
        let packageTask = vm.task;
        packageTask.status = newStatus;
        Tasks.updateTaskStatus(myToken, packageTask)
            .then((result) => {
                vm.task = result.data;
            })
    }
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
            .then((result) => {
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

    vm.submitBatch = function() {
        Tasks.postBatch(myToken, vm.tempTasks)
            .then((result) => {
                console.log(result);
                $state.go('tab.dash')
            })
    }
})


// account tab
.controller('AccountCtrl', function(Tasks, mySocket, LocalStorage, $state) {
    const vm = this;
    const myToken = LocalStorage.getToken();
    vm.$onInit = function() {
        vm.child = {};
        Tasks.getChildInfo(myToken)
            .then((result) => {
                const user = result.data;
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
            .then((result) => {
                const parentWithAllInfo = result.data;
                const parentChildID = parentWithAllInfo.parentChildID;
                const connectionObject = {
                        user: parentWithAllInfo,
                        roomID: parentChildID
                    }
                    // mySocket.emit('room', connectionObject);
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
