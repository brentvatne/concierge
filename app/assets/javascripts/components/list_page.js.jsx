global.ListPage = React.createClass({
  getInitialState: function() {
    return {
      upcomingBookings: [],
      completedBookings: [],
      loaded: false
    }
  },

  componentDidMount: function() {
    this.loadUpcomingBookings();
  },

  cancelBookingFn: function(booking) {
    return function() {
      console.log("cancel: " + booking.id);
    }
  },

  loadUpcomingBookings: function() {
    var self = this;

    $.get('/bookings/upcoming', function(response) {
      self.setState({upcomingBookings: response})
    })
  },

  renderUpcomingBookings: function() {
    var list = [], self = this;

    this.state.upcomingBookings.forEach(function(b) {
      list.push(
        <div className="booking">
          <div className="booking--info">
            <h2>{b.title}</h2>
            <p className="booking--info--date-time">
              <span className="time">
                {b.time}
              </span>

              <span>, </span>

              <span className="date">
                {b.date}
              </span>
            </p>

            <p className="booking--info--location">
              <span>
                Within 500m of {b.address}
              </span>
            </p>
          </div>

          <div className="booking--actions">
            <a href="#" onClick={self.cancelBookingFn(b)}>
              Cancel
            </a>
          </div>
        </div>
      )
    });

    return list;
  },

  render: function() {
    return (
      <div>
        <PrimaryNavigation showScheduleBooking={true} />

        <div className="container">
          <div className="card list-page-content">
            {this.renderUpcomingBookings()}
          </div>
        </div>
      </div>
    )
  }
});
