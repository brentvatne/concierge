global.EditBookingPage = React.createClass({
  getDefaultProps: function() {
    return { booking: {} }
  },

  getInitialState: function() {
    return {
      isLoading: false
    }
  },

  submitForm: function(booking) {
    var self = this,
        data = {booking: booking};

    this.setState({isLoading: true});

    $.put('/bookings/' + this.props.booking.id, data).done(function(response) {
      if (response.success == true) {
        window.location.href = '/'
      } else {
        self.setState({isLoading: false});
        alert('Something went wrong')
      }
    }).complete(function() {
      // Problem!
    });
  },

  render: function() {
    return (
      <div>
        <PrimaryNavigation showBackHome={true} extraClasses="" />
        <LoadingOverlay isVisible={this.state.isLoading} />

        <div className="container">
          <h2 className="page-subtitle">Edit booking</h2>

          <div className="card list-page-content">
            <BookingForm onSubmit={this.submitForm} booking={this.props.booking} />
          </div>
        </div>
      </div>
    )
  }
});
