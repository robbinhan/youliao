angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})
.controller('PlaylistsCtrl', function($scope,PlayLists,x2js,$window,$stateParams) {

  var playlistId = $stateParams.playlistId

  var playlists = [];
  PlayLists.all(playlistId).then(function(data){
      json_playlists = x2js.xml_str2json(data);
      if (playlistId == 'hacknews' || playlistId == 'startupnews') {
        items = json_playlists.rss.channel.item
        angular.forEach(items, function(value, key) {
          this.push({id:value.link,title:{__text:value.title}});
        }, playlists);
      } else {
        playlists = json_playlists.feed.entry  
      }
      $scope.playlists = playlists;
    });

  $scope.open = function(href) {
    $window.open(href,'_blank','location=yes');
  }
});
