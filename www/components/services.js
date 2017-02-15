(function() {
    'use strict';
    // const SERVER_URL = `http://localhost:5000`;
    const SERVER_URL = `http://10.6.66.4:5000`;

    angular.module('pandoras-box.controllers')
        .service('Tasks', tasks)
        .service('LocalStorage', localStorage)


    function tasks($http) {
        // Might use a resource here that returns a JSON array
        // Some fake testing data

        var parentOrChild;

        var tasks = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'img/max.png'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'img/adam.jpg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'img/perry.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'img/mike.png'
        }];



        this.all = function() {
            return tasks;
        }

        this.remove = function(task) {
            tasks.splice(tasks.indexOf(task), 1);
        }

        this.get = function(taskId) {
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].id === parseInt(taskId)) {
                    return tasks[i];
                }
            }
            return null;
        }

        this.getActiveTasks = function(userID) {
            return $http.get(`${SERVER_URL}/active-batch/1`); //need to change hard coded 1
        }
        this.postAuth = function(token) {
            return $http.post(`${SERVER_URL}/auth`, {
                token: token,
                parentOrChild: this.parentOrChild
            });



        // this.getSingleTask = function(batchEventId) {
        //   console.log(batchEventId);
        //   return $http.get(`${SERVER_URL}/active-batch/${batchEventId}`)
        // }


        }
    }

    function localStorage(localStorageService) {
        const token = "token";

        this.setToken = function(jwt) {
            localStorageService.set(token, jwt);
        }

        this.getToken = function() {
            return localStorageService.get(token);
        }


    }


}());
