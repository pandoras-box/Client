(function() {
    'use strict';
    angular.module('pandoras-box')
        .config(config)

    function config($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
        // setup an abstract state for the tabs directive
            .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'components/tabs.html'
        })

        // Each tab has its own nav history stack:

        .state('landing', {
            url: '/landing',
            templateUrl: 'components/landing.html',
            controller: 'LandingCtrl'
        })


    .state('tab.tasks', {
        url: '/tasks',
        // component: 'tab-tasks2',
        views: {
          'tab-tasks': {
            templateUrl: './components/tab-tasks.html',
            controller: 'TasksCtrl'
          }
        }
      })
      .state('tab.task-detail', {
        url: '/tasks/:taskId',
        views: {
          'tab-tasks': {
            templateUrl: 'components/task-detail.html',
            controller: 'TaskDetailCtrl'
          }
        }
      })

        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'components/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        })

        .state('oauth', {
            url: '/oauth',
            // component: 'oauth',
            templateUrl: 'components/oauth.html',
            controller: 'OauthCtrl'
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/landing');

    }

}());
