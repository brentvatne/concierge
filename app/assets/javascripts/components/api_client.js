global.ApiClient = {
  bookNow: function(data) {
    $.post('/book-now', data).
      complete(function() { window.location.reload() })
  }
}
