(function() {
  'use strict';
  angular.module('pandoras-box')
  .component('tab-chat-detail', {
    controller:controller,
    templateUrl: './components/tab-chat-detail.html'
  })


  function controller($stateParams, Chats){
    const vm = this;

    vm.chat = Chats.get($stateParams.chatId);

    vm.$onInit = function(){
      console.log("In chat detail!");

    }

  }




}());
