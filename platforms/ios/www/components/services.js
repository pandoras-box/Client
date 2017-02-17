(function() {
    'use strict';
    // const SERVER_URL = `http://localhost:5000`;




    // const SERVER_URL = `https://pandoras-box-team.herokuapp.com`;
        const SERVER_URL = 'http://10.6.65.77:5000';
    // const SERVER_URL = `http://192.168.0.5:5000`;
    // const SERVER_URL = `http://10.6.65.77:5000`;





    angular.module('pandoras-box.controllers')
        .service('Tasks', tasks)
        .service('LocalStorage', localStorage)

    function tasks($http) {
        // Might use a resource here that returns a JSON array
        // Some fake testing data
        var parentOrChild;
        this.specificTask = {};


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

        this.validate = function(userToken) {
            return $http.post(`${SERVER_URL}/secure/validate`, {
                userToken
            });
        }

        this.getActiveTasks = function(userToken) {
            return $http.post(`${SERVER_URL}/secure/active-batch`, {userToken});

        }

        this.postAuth = function(token) {
            return $http.post(`${SERVER_URL}/auth`, {
                token: token,
                parentOrChild: this.parentOrChild
            });
        }

        this.getEvents = function(userToken) {
            return $http.post(`${SERVER_URL}/secure/event`, {
                userToken
            });
        }

        this.getAccountPageInfo = function(userToken) {
            return $http.post(`${SERVER_URL}/secure/account-page-info`, {
                userToken
            });
        }

        this.getChildInfo = function(userToken){
          return $http.post(`${SERVER_URL}/secure/get-child-info`, {userToken});

        }

        this.pairParentChild = function(userToken, childEmail) {
            return $http.post(`${SERVER_URL}/secure/pair-parent-child`, {
                userToken,
                childEmail
            });
        }

        this.getUser = function(userToken) {
            return $http.post(`${SERVER_URL}/secure/get-user`, {
                userToken
            });
        }

        this.postBatch = function(userToken, tempTasks) {
            return $http.post(`${SERVER_URL}/secure/batch`, {
                userToken,
                tempTasks
            });
        }

        this.updateTaskStatus = function(userToken, currentTask) {
          return $http.post(`${SERVER_URL}/secure/update-task-status`, {
              userToken,
              currentTask
          });
        }

        // this.getSingleTask = function(batchEventId) {
        //   console.log(batchEventId);
        //   return $http.get(`${SERVER_URL}/active-batch/${batchEventId}`)
        // }
        this.getParentChildID = function(userToken) {
            return $http.post(`${SERVER_URL}/secure/get-parent-child-id`, {
                userToken
            });
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

        this.removeToken = function() {
            localStorageService.remove(token);
        }

    }



}());
