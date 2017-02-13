(function() {
  'use strict';
  angular.module('pandoras-box')
  .component('landing', {
    controller:controller,
    templateUrl: './components/landing.html'
  })



  function controller(){
    const vm = this;

  

    vm.$onInit = function(){
      console.log("In modular Landing page!!");

    }

  }




}());
