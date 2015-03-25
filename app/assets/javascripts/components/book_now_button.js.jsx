global.BookNowButton = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false
    }
  },

  createBooking: function(e) {
    e.preventDefault();
    var self = this;

    self.setState({isLoading: true});
    navigator.geolocation.getCurrentPosition(function(position) {
      var data = {lat: position.coords.latitude, lon: position.coords.longitude}
      $.post('/book-now', data).
        complete(function() { window.location.reload() })
    })
  },

  render: function() {
    return (
      <span>
        <LoadingOverlay isVisible={this.state.isLoading} />
        <a href="#" onClick={this.createBooking}>
          Book now!
        </a>
      </span>
    )
  }

});
