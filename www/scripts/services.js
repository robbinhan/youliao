angular.module('starter.services', [])

.factory('PlayLists', function($q,$http) {
  var playlists = {};
  var promise;
  var config = {
    'stackexchange':'http://stackexchange.com/feeds',
    'segmentfault':'http://segmentfault.com/feeds',
    'stackoverflow':'http://stackoverflow.com/feeds',
    'hacknews':'https://news.ycombinator.com/rss',
    'startupnews':'http://news.dbanotes.net/rss',
    'guokr':'http://www.guokr.com/rss/',
    'dgtle':'http://www.dgtle.com/rss/dgtle.xml',
    'next':'http://next.36kr.com/feed',
    'logdownweek':'http://feeds.feedburner.com/logdown/hot_week?format=xml'
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
