(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$rootScope', '$timeout', '$location'];

    function AppController($rootScope, $timeout, $location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'AppController';

         activate();

        function activate() {
            console.log(vm.title + ' initialized');
		}
	}
})();