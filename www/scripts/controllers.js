angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Apps) {
  $scope.menuItems = Apps.getConfig();
})
.controller('PlaylistsCtrl', function($scope, PlayLists, $window, $stateParams, 
  $ionicLoading, Apps) {
  var config = Apps.getConfig();

  var getPlayLists = function(type) {
    var playlistId = $stateParams.playlistId ? $stateParams.playlistId : 0;

    if (type == 'normal') {
      //显示loading层
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 500
      });
    }

    //获取文章列表
    PlayLists.all(playlistId, config).then(function(data){
      var menuitem = config[playlistId];
      var filterType = menuitem.filterType;
      $scope.subtitle = menuitem.name;
      if (filterType == 0) {
        $scope.playlists = PlayLists.rss2(data);
      } else if (filterType == 1) {
        $scope.playlists = PlayLists.feed(data);
      } else {
        $scope.playlists = PlayLists.feed2(data);
      }
      if (type == 'normal') {
        $ionicLoading.hide();
      } else if (type == 'pulling') {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  }

  /**
   * 打开某篇文章
   * @param  {[type]} href [description]
   * @return {[type]}      [description]
   */
  $scope.open = function(href) {
    $window.open(encodeURI(href),'_system','location=no');
  }

  /**
   * 下拉刷新文章列表
   * @return {[type]} [description]
   */
  $scope.doRefresh = function(){
    getPlayLists('pulling');
  }

  /**
   * 拷贝文章链接到缓冲区
   * @return {[type]} [description]
   */
  $scope.copy = function(id){
    window.cordova.plugins.clipboard.copy(id);
  }

  $scope.share = function(title, desc, url, thumb) {
    PlayLists.share(title, desc, url, thumb);
  };

  getPlayLists('normal');
});
