var DisplayView = Backbone.View.extend({
  el: '#display',
  initialize: function () {
    _.bindAll(this);
    Backbone.Events.bind('photosDisplay', this.renderPhotos);
  },
  renderPhotos: function (photos) {
    this.photos = photos;
    $(this.el).find('.disp-photo').remove();
    var template = _.template($('#photo-display').html());
    var frag = document.createDocumentFragment();
    _(photos).each(function (photo) {
      frag.appendChild($(template(photo))[0]);
    });
    $(this.el).append(frag);
    return this;
  }
});

var Album = Backbone.Model.extend({
  defaults: {
    thumbsize: '1024'
  },
  url: function () {
    return 'http://picasaweb.google.com/data/feed/api/user/' + this.get('userId') + '/albumid/' + this.get('id') + '?alt=json&thumbsize=' + this.get('thumbsize');
  },
  parse: function (body) {
    var photos = [];
    _(body.feed.entry).each(function (photo) {
      photos.push({
        url: photo.media$group.media$thumbnail[0].url
      });
    });
    return {
      photos: photos
    }
  }
});

var Albums = Backbone.Collection.extend({
  model: Album,
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
  events: {
    'click img': 'fetchAlbum'
  },
  initialize: function () {
    _.bindAll(this);
  },
  render: function (template) {
    $(this.el).html(template(this.model.toJSON()));
    return this;
  },
  fetchAlbum: function () {
    this.model.fetch({
      success: this.showAlbum
    });
  },
  showAlbum: function () {
    Backbone.Events.trigger('photosDisplay', this.model.get('photos'));
  }
});

var AlbumSliderView = Backbone.View.extend({
  el: '#albums',
  initialize: function () {
    _.bindAll(this);
  },
  fetchForUser: function(userId) {
    this.collection = new Albums();
    this.collection.setUserId(userId);
    this.collection.fetch({
      success: this.renderAlbums
    });
  },
  renderAlbums: function () {
    var albumView = null;
    var frag = document.createDocumentFragment();
    var liTemplate = _.template($('#album-li').html());
    _(this.collection.models).each(function (album) {
      albumView = new AlbumView({
        model: album
      });
      frag.appendChild(albumView.render(liTemplate).el);
    });
    $(this.el).html(frag);
  }

});


$(document).ready(function () {
  var displayView = new DisplayView();
  var albumSliderView = new AlbumSliderView();
  albumSliderView.fetchForUser('116342059677336243524');



});