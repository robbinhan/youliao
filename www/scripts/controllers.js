angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})
.controller('PlaylistsCtrl', function($scope, PlayLists, x2js, $window, $stateParams, 
  $ionicLoading,$ionicActionSheet) {

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
    console.log(json_playlists);
    //hacknews、startupnews、taobaoued、sinaued限制30条消息
    if (playlistId == 'hacknews' || playlistId == 'startupnews'
     || playlistId == 'dgtle' || playlistId == 'logdownweek') {
      items = json_playlists.rss.channel.item
      var len = items.length;
      var item = {};
      for (var i = 0; i < len; i++) {
        if (i === 30) {
          break;
        }
        item = items[i];
        if (item.title != "") {
          playlists.push({
            id:item.link,
            title:{__text:item.title},
            published:item.pubDate
          });
        }
      }
    } else if (playlistId == 'next') {
      entrys = json_playlists.feed.entry;
      var len = entrys.length;
      for (var i = 0; i < len; i++) {
        if (i === 30) {
          break;
        }
        item = entrys[i];
        if (item.title != "") {
          playlists.push({
            id:item.link._href,
            title:{__text:item.title},
            published:item.published
          });
        }
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
    $ionicActionSheet.show({
        buttons: [
            { text: '<b>分享至微信朋友圈</b>' },
            { text: '分享给微信好友' }
        ],
        titleText: '分享',
        cancelText: '取消',
        cancel: function() {
            // 取消时执行
        },
        buttonClicked: function(index) {
            if(index == 0) {
                $scope.shareViaWechat(WeChat.Scene.timeline, title, desc, url, thumb);
            }
            if(index ==1 ) {
                $scope.shareViaWechat(WeChat.Scene.session, title, desc, url, thumb);
            }
        }
    });
  };

  $scope.shareViaWechat = function(scene, title, desc, url, thumb) {
    // 创建消息体
    var msg = {
        title: title ? title : "有料",
        description: desc ? desc : "新闻聚合器",
        url: url ? url : "http://fir.im/youliao",
        thumb: thumb ? thumb : null
    };

    WeChat.share(msg, scene, function() {
        $ionicPopup.alert({
            title: '分享成功',
            template: '感谢您的支持！',
            okText: '关闭'
        });
    }, function(res) {
        $ionicPopup.alert({
            title: '分享失败',
            template: '错误原因：' + res + '。',
            okText: '我知道了'
        });
    });
  };

  getPlayLists('normal');
});
