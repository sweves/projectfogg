stories.controller('AppCtrl', ['$scope', '$compile', function($scope, $compile) {
  console.log('inside AppCtrl');
}]);

stories.controller('NavCtrl', 
['$scope', '$location', '$http', function ($scope, $location, $http) {
  console.log('inside NavCtrl');
  $scope.navClass = function (page) {
    var currentRoute = $location.path().substring(1) || 'stories';
    return page === currentRoute ? 'active' : '';
  };
  
  $scope.loadAbout = function () {
        $location.url('/about');
    };
    
      $scope.loadStories = function () {
        $location.url('/stories');
    };
    
      $scope.loadUpload = function () {
        $location.url('/upload');
    };

    $http.get('/json').success(function(data) {
      $scope.artists = data.users;
      $scope.artistOrder = 'name';
    });
    
}]);

stories.controller('AboutCtrl', ['$scope', '$compile', function($scope, $compile) {
  console.log('inside about controller');
}]);

stories.controller('StoriesCtrl', ['$scope', '$http', '$compile', '$routeParams', function($scope, $http, $compile, $routeParams){
  console.log('inside stories controller');

  $http.get('/json').success(function(data) {
    $scope.artists = data.users;
    $scope.artistOrder = 'name';
  });

  $http.get('/json/all').success(function(data) {
    console.log(data);
    $scope.posts = data.results;
  });

}]);

stories.controller('DetailsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
  $http.get('/json').success(function(data) {
    $scope.artists = data.users;
    $scope.whichItem = $routeParams.itemId;
    $scope.artistID = data.id;
    var userId = data.users[$scope.whichItem].id;
    $http.get('/json/' + userId).success(function(data) {
      $scope.posts = data.results;
    });
  });


  $http.get('/json/all').success(function(data) {
    console.log(data);
    $scope.posts = data.results;
    $scope.postid = data.id;
  });

}]);

stories.controller('UploadCtrl', ['$scope', '$http', '$compile', function($scope, $http, $compile) {
  $http.get('/json').success(function(data) {
    // console.log(data);
    $scope.artists = data.users;
    $scope.upload = data.upload;
  });
  $scope.sendPost = function() {
    var formData = new FormData(document.form);
    $scope.results = undefined;
    $http.post('/upload', formData, {
      headers:{ 'Content-type': undefined },
      transformRequest: null
    })
      .success(function(data, status) {
        $scope.results = data;
      })
      .error(function(data, status) {
        console.warn(data);
      });
  }
}]);


