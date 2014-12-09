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
  var s3_upload = function(file) {
    var s3upload = new S3Upload({
      s3_object_name: 'photo' + (+ new Date()) + file.name,
      file_dom_selector: 'photo',
      s3_sign_put_url: '/sign_s3',
      onProgress: function(percent, message) {
        console.log('Upload progress: ' + percent + '% ' + message);
      },
      onFinishS3Put: function(public_url) {
        console.log('Upload completed. Uploaded to: '+ public_url);
        $scope.previewUrl = public_url;
        avatar.value = public_url;
        $scope.$apply();
      },
      onError: function(status) {
        status_elem.innerHTML = 'Upload error: ' + status;
      }
    });
  };
  $scope.fileNameChanged = function(e) {
    var file = e.files[0],
      type = file.type.split('/');
    console.log(file, type);
    if(type[0] === 'image') s3_upload(file);
    else alert('Please upload image only');
  };
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


