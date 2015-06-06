app.config(function ($stateProvider) {

    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'js/register/register.html',
        controller: 'RegisterCtrl'
    });

});

app.controller('RegisterCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    //SCOPE METHODS
    $scope.registerUser = function (registerInfo) {

        $scope.error = null;

        AuthService.signUp(registerInfo).then(function () {
            $state.go('principal');
        }).catch(function () {
            $scope.error = 'Invalid signUp credentials.';
        });

    };



});