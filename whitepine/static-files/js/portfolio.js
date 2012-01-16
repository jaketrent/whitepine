var DisplayView = Backbone.View.extend({
  el: '#display',
  events: {
    'click .arrow.left': 'left',
    'click .arrow.right': 'right'
  },
  initialize: function () {
    _.bindAll(this);
    this.$('.arrow').hide();
    Backbone.Events.bind('photosDisplay', this.renderPhotos);
  },
  renderPhotos: function (photos) {
    this.photos = photos;
    this.index = 0;
    $(this.el).children('.disp-photo').remove();
    this.$('.arrow').show();
    var template = _.template($('#photo-display').html());
    var frag = document.createDocumentFragment();
    _(photos).each(function (photo) {
      frag.appendChild($(template(photo))[0]);
    });
    $(this.el).append(frag);
    return this;
  },
  showPhoto: function () {
    var $photos = $(this.el).children('.disp-photo');
    $photos.hide();
    $photos.eq(this.index).show();
  },
  left: function () {
    this.moveIndex(-1);
    this.showPhoto();
  },
  right: function () {
    this.moveIndex(1);
    this.showPhoto();
  },
  moveIndex: function (move) {
    if (this.index + move == this.photos.length) {
      this.index = 0;
    } else if (this.index + move < 0) {
      this.index = this.photos.length - 1;
    } else {
      this.index = this.index + move;
    }
  }
});

var Album = Backbone.Model.extend({
  defaults: {
    thumbsize: '1024'
  },
  url: function () {
    return 'http://picasaweb.google.com/data/feed/api/user/' + this.get('userId') + '/albumid/' + this.get('id') + '?alt=json&thumbsize=' + this.get('thumbsize') + '&callback=?';
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
    return 'http://picasaweb.google.com/data/feed/api/user/' + this.userId + '?alt=json&callback=?';
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
    Backbone.Events.trigger('albumClick');
  }
});

var AlbumSliderView = Backbone.View.extend({
  el: '#albums',
  initialize: function () {
    _.bindAll(this);
    this.$('#albums-tgl').hide();
    Backbone.Events.bind('albumClick', this.hideAlbums);
    Backbone.Events.bind('albumTglClick', this.showAlbums);
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
    $('#albums').find('img').eq(0).click();
  },
  hideAlbums: function () {
    $(this.el).animate({
      left: 1024,
      opacity: 0
    });
  },
  showAlbums: function () {
    $(this.el).animate({
      left: 0,
      opacity: 1
    });
  }

});

var AlbumsToggleView = Backbone.View.extend({
  el: '#albums-tgl',
  events: {
    'click': 'hideTgl'
  },
  initialize: function () {
    _.bindAll(this);
    Backbone.Events.bind('albumClick', this.showTgl);
    $(this.el).hide();
  },
  showTgl: function () {
    $(this.el).show();
  },
  hideTgl: function () {
    $(this.el).hide();
    Backbone.Events.trigger('albumTglClick');
  }
});


$(document).ready(function () {
  var displayView = new DisplayView();
  var albumSliderView = new AlbumSliderView();
  albumSliderView.fetchForUser('116342059677336243524');
  new AlbumsToggleView();


});