angular.module('starter.services', [])

.factory('PlayLists', function($q,$http) {
  var playlists = {};
  var promise;
  var config = {
    'stackexchange':'http://stackexchange.com/feeds/questions',
    'segmentfault':'http://segmentfault.com/feeds',
    'stackoverflow':'http://stackoverflow.com/feeds',
    'hacknews':'https://news.ycombinator.com/rss',
    'startupnews':'http://news.dbanotes.net/rss',

    'taobaoued':'http://ued.taobao.org/blog/feed/',
    'sinaued':'http://ued.sina.com.cn/?feed=rss2',
  };

  playlists.all = function(playlistId){
    var defer = $q.defer();
    var url = config[playlistId];
    $http.get(url).
    success(function(data, status, headers, config) {
      defer.resolve(data);
    }).
    error(function(data, status, headers, config) {
      defer.reject(data);
    });

    return defer.promise;
    
  }
  return playlists;
});
