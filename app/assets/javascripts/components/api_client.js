global.ApiClient = {
  bookNow: function(data) {
    $.post('/book-now', data).
      complete(function() { window.location.reload() })
  },

  addressForCoords: function(data, callback) {
    $.get('/locations/address-for-coords', data).
      success(callback);
  }
}
