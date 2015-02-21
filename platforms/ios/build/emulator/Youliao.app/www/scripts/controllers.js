angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})
.controller('PlaylistsCtrl', function($scope,PlayLists,x2js,$window,$stateParams,$ionicLoading) {

  var getPlayLists = function(type) {

    //请求的rss类型
    var playlistId = $stateParams.playlistId;

    if (playlistId === undefined) {
      playlistId = 'startupnews';
    }

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
    PlayLists.all(playlistId).then(function(data){
      $scope.playlists = formatPlayLists(data,playlistId);
      if (type == 'normal') {
        $ionicLoading.hide();
      } else if (type == 'pulling') {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  }

  /**
   * 组织整理get到的文章列表
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  var formatPlayLists = function(data,playlistId) {
    var playlists = [];
    json_playlists = x2js.xml_str2json(data);
      //hacknews和startupnews限制30条消息
      if (playlistId == 'hacknews' || playlistId == 'startupnews') {
        items = json_playlists.rss.channel.item
        var len = items.length;
        var item = {};
        for (var i = 0; i < len; i++) {
          if (i === 30) {
            break;
          }
          item = items[i];
          playlists.push({
            id:item.link,
            title:{__text:item.title}
          });
        }
      } else {
        playlists = json_playlists.feed.entry  
      }
      return playlists;
  }

  /**
   * 打开某篇文章
   * @param  {[type]} href [description]
   * @return {[type]}      [description]
   */
  $scope.open = function(href) {
    $window.open(href,'_blank','location=yes');
  }

  /**
   * 下拉刷新文章列表
   * @return {[type]} [description]
   */
  $scope.doRefresh = function(){
    getPlayLists('pulling');
  }

  getPlayLists('normal');
});
