var DisplayView = function () {
  return Backbone.View.extend({
    el: '#display',
    initialize: function () {
      _.bindAll(this);
    }
  });
};

var AlbumPhoto = Backbone.Model.extend({
    view : null,

    initialize : function() {
        this.fetch();
        this.bind("change", function() {
            this.view=new AlbumView({model : this});
            this.view.render();
        });
    },
    url:function() {
        return "http://picasaweb.google.com/data/feed/api/user/"+this.attributes.user+"/albumid/"+this.attributes.id+"?authkey="+this.attributes.authkey+"&alt=json&callback=?";
    },
    parse : function(response) {
        var thumbnailTemp;
        _.each(response.feed.entry,function(photo) {
            thumbnailTemp=_.last(photo.media$group.media$thumbnail);
            photo.media$group.media$thumbnail=_.select(photo.media$group.media$thumbnail,function(thumbnail) {
                return (thumbnail==thumbnailTemp);
            });
        });
        return response;
    }
});

var Album = Backbone.Model.extend({
  defaults: {
    thumbsize: '1024'
  },
  url: function () {
    return 'http://picasaweb.google.com/data/feed/api/user/' + this.get('userId') + '/albumid/' + this.get('id') + '?alt=json&thumbsize=' + this.get('thumbsize');
  }
});

var UserAlbums = Backbone.Collection.extend({
  initialize: function () {
    _.bindAll(this);
  },
  setUserId: function (userId) {
    this.userId = userId;
  },
  url: function () {
    return 'http://picasaweb.google.com/data/feed/api/user/' + this.userId + '?alt=json';
  },
  parse: function (body) {
    var self = this;
    var albums = []
    _(body.feed.entry).each(function (album) {
      albums.push({
        id: album.gphoto$id.$t,
        cover: album.media$group.media$thumbnail[0].url,
        userId: self.userId
      });
    });
    return albums;
  }
});

var AlbumView = Backbone.View.extend({
  tagName: 'li',
  initialize: function () {
    _.bindAll(this);
  },
  render: function () {
    $(this.el).html('<img src="' + this.model.get('cover') + '" />');
    return this;
  }
});

var AlbumSliderView = Backbone.View.extend({
  el: '#albums',
  initialize: function () {
    _.bindAll(this);
  },
  fetchForUser: function(userId) {
    this.collection = new UserAlbums();
    this.collection.setUserId(userId);
    this.collection.fetch({
      success: this.renderAlbums
    });
  },
  renderAlbums: function () {
    var albumView = null;
    var frag = document.createDocumentFragment();
    _(this.collection.models).each(function (album) {
      albumView = new AlbumView({
        model: album
      });
      frag.appendChild(albumView.render().el);
    });
    $(this.el).html(frag);
  }

});


$(document).ready(function () {
  var albumSliderView = new AlbumSliderView();
  albumSliderView.fetchForUser('116342059677336243524');


});