var app = angular.module('leevia', ['ngRoute']);

app.constant('menu', {pages: [
    // Voci menu
    {name: '', title: 'PARTECIPA', templateUrl: 'views/home.html'},
    {name: 'awards', title: 'PREMI', templateUrl: 'views/awards.html'},
    {name: 'video', title: 'VIDEO', templateUrl: 'views/video.html'},
    {name: 'players', title: 'PARTECIPANTI', templateUrl: 'views/players.html'}
]});


app.config(function($routeProvider, menu) {
    // Configurazione routing
    menu.pages.forEach(function(page) {
        $routeProvider.when('/' + page.name, {
            templateUrl: page.templateUrl
        });
    });
});

app.controller('navbarCtrl', function($scope, $rootScope, $location, menu) {
    $scope.pages = menu.pages;
    $scope.location = $location.path();
    $rootScope.$on('$routeChangeSuccess', function() {
        $scope.location = $location.path();
    });
    // Chiude menu navbar (invocato al cambio pagina)
    $scope.closeNavbar = function() {
        $('#navbar').collapse('hide');
    };
});

app.controller('players', function($scope, $http, $q) {
    $http.get('https://api.github.com/users/octocat/followers')
    .then(function(response) {
        var followers = response.data.slice(0, 10)
        var promises = followers.map(function(follower) {
            return $http.get('https://api.github.com/users/' + follower.login)
            .then(function(response) {
                follower.name = response.data.name;
                return follower;
            });
        });
        return $q.all(promises);
    })
    // Se request a github fallisce x qualche errore, carica stub locale.
    // Gestisce anche superamento rate limit, vedi: https://developer.github.com/v3/rate_limit/
    .catch(function(error) {
        return $http.get('js/followers_stub.json')
        .then(function(response) {
            return response.data;
        });
    })
    .then(function(followers) {
        $scope.followers = followers;
    })
});
