'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'LoginHomeCtrl'
    });
});

app.controller('LoginHomeCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        $state.go('principal');

        //TODO aplicar autenticacion
        AuthService.login(loginInfo).then(function () {
            $state.go('principal');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});