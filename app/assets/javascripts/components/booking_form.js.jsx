global.BookingForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getDefaultProps: function() {
    return { booking: {}, isLoading: false }
  },

  getInitialState: function() {
    var booking = this.props.booking;

    return {
      title: booking.title || '',
      date: booking.date || '',
      time: booking.time || '',
      address: booking.address || ''
    }
  },

  submit: function(e) {
    e.preventDefault();

    var booking = {
      title: this.state.title, date: this.state.date,
      time: this.state.time, address: this.state.address
    };

    this.props.onSubmit(booking);
  },

  getCurrentLocation: function(e) {
    e.preventDefault();
    this.setState({isLoading: true});
    var self = this;

    var failedToFindLocation = function() {
      alert("Sorry, your location could not be found");
    };

    var setAddressToCurrent = function(position) {
      var data = {lat: position.coords.latitude, lon: position.coords.longitude}

      ApiClient.addressForCoords(data, function(result) {
        self.setState({isLoading: false});

        if (result.error) {
          failedToFindLocation();
        } else {
          self.setState({address: result.address});
        }
      });
    };

    navigator.geolocation.getCurrentPosition(setAddressToCurrent, failedToFindLocation, {
      maximumAge: 60000, enableHighAccuracy: true
    });
  },

  render: function() {
    return (
      <form onSubmit={this.submit} className="new-booking-form">
        <input key="title" ref="titleInput" type="text"
          valueLink={this.linkState('title')}
          placeholder="Enter a description, eg: 'Visit Grandma'"/>
        <input key="date" ref="dateInput" type="text"
          valueLink={this.linkState('date')}
          placeholder="Date, eg: 'March 22' or 'January 1 2015'"/>
        <input key="time" ref="timeInput" type="text"
          valueLink={this.linkState('time')}
          placeholder="Time, eg: '5:00pm' or '17:00'"/>
        <div className="address-input-wrapper">
          <input key="address" ref="addressInput" type="text"
            valueLink={this.linkState('address')}
            placeholder="Desired location with city: '123 Main St, Vancouver'"/>
          <a onClick={this.getCurrentLocation} className="get-current-location-button">
            <span className="ion-pinpoint" />
          </a>
        </div>

        <div className="form--actions">
          <button className="medium-button">Save</button>
          <a href="/" className="medium-button cancel-button">Cancel</a>
        </div>

        <LoadingOverlay isVisible={this.state.isLoading} />
      </form>
    )
  }
});
