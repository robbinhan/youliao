angular.module('starter.services', [])

.factory('PlayLists', function($q, $http, x2js, $ionicActionSheet) {
  var playlists = {};
  var promise;
  
  playlists.all = function(playlistId, config){
    var defer = $q.defer();
    var url = config[playlistId].url;
    $http.get(url).
    success(function(data, status, headers, config) {
      defer.resolve(data);
    }).
    error(function(data, status, headers, config) {
      defer.reject(data);
    });

    return defer.promise;
  }

  playlists.share = function(title, desc, url, thumb){
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
            shareViaWechat(WeChat.Scene.timeline, title, desc, url, thumb);
          }
          if(index ==1 ) {
            shareViaWechat(WeChat.Scene.session, title, desc, url, thumb);
          }
        }
    });
  }

  var shareViaWechat = function(scene, title, desc, url, thumb) {
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

  playlists.rss2 = function(data){
    var playlists = [];
    var json_playlists = x2js.xml_str2json(data);
    var items = json_playlists.rss.channel.item
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
    return playlists;
  }

  playlists.feed = function(data){
    var playlists = [];
    var json_playlists = x2js.xml_str2json(data);
    var entrys = json_playlists.feed.entry;
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
    return playlists;
  }

  playlists.feed2 = function(data){
    var json_playlists = x2js.xml_str2json(data);
    return json_playlists.feed.entry;
  }

  return playlists;
})

.factory('Apps', function() {

  var apps = {};

  var config = [
    {'url':'https://news.ycombinator.com/rss','name':'HackNews','ico':'hacknews.ico','filterType':0},
    {'url':'http://news.dbanotes.net/rss','name':'StartupNews','ico':'startupnews.ico','filterType':0},
    {'url':'http://www.guokr.com/rss/','name':'果壳','ico':'guokr.png','filterType':2},
    {'url':'http://www.dgtle.com/rss/dgtle.xml','name':'数字尾巴','ico':'dgtle.ico','filterType':0},
    {'url':'http://next.36kr.com/feed','name':'Next','ico':'next.ico','filterType':1},
    {'url':'http://feeds.feedburner.com/logdown/hot_week?format=xml','name':'LogDown Week','ico':'logdown.jpg','filterType':0},
    {'url':'http://stackexchange.com/feeds','name':'StackExchange','ico':'stackexchange.ico','filterType':2},
    {'url':'http://segmentfault.com/feeds','name':'SegmentFault','ico':'segmentfault.ico','filterType':2},
    {'url':'http://stackoverflow.com/feeds','name':'StackoverFlow','ico':'stackoverflow.ico','filterType':2}
  ];

  apps.getConfig = function(){
    return config;
  }

  return apps;
});