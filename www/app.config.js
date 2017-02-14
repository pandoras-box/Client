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

      .state('landing', {
          url: '/landing',
          templateUrl: 'components/landing.html',
          controller: 'LandingCtrl'
      })

      .state('oauth', {
          url: '/oauth',
          // component: 'oauth',
          templateUrl: 'components/oauth.html',
          controller: 'OauthCtrl'
      })

      .state('tab.dash', {
          url: '/dash',
          views: {
              'tab-dash': {
                  templateUrl: 'components/tab-dash.html',
                  controller: 'TaskDashCtrl'
              }
          }
      })

      .state('tab.addTasks', {
          url: '/addTasks',
          views: {
            'tab-addTasks': {
              templateUrl: 'components/tab-addTasks.html',
              controller: 'AddTasksCtrl'
            }
          }
      })

      .state('tab.task-detail', {
        url: '/dash/:taskId',
        views: {
          'tab-dash': {
            templateUrl: 'components/task-detail.html',
            controller: 'TaskDetailCtrl as $ctrl'
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

      $urlRouterProvider.otherwise('/landing');
    }
}());
