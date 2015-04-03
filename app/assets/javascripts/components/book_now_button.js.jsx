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

    var bookNow = function(position) {
      var data = {lat: position.coords.latitude, lon: position.coords.longitude}
      ApiClient.bookNow(data);
    };

    var failedToFindLocation = function() {
      alert("Sorry, your location could not be found");
    };

    navigator.geolocation.getCurrentPosition(bookNow, failedToFindLocation, {
      maximumAge: 60000, enableHighAccuracy: true
    });
  },

  render: function() {
    return (
      <span>
        <LoadingOverlay isVisible={this.state.isLoading} />
        <a href="#" onClick={this.createBooking} className="green">
          Book now
        </a>
      </span>
    )
  }

});
