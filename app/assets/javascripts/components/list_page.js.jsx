global.ListPage = React.createClass({
  getInitialState: function() {
    return {
      upcomingBookings: [],
      completedBookings: [],
      isLoading: false
    }
  },

  componentDidMount: function() {
    this.loadUpcomingBookings();
  },

  cancelBookingFn: function(booking) {
    var self = this;

    return function(e) {
      e.preventDefault()
      self.setState({isLoading: true});

      $.ajax({
          url: '/bookings/' + booking.id,
          type: 'DELETE',
          success: function(result) {
            // Lazy
            window.location.reload();
          },
          complete: function() {
            // self.setState({isLoading: false});
          }
      });
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

    if (this.state.upcomingBookings.length == 0) {
      return (<p className="empty-list-notification">No upcoming bookings!</p>)
    }

    this.state.upcomingBookings.forEach(function(b) {
      var actions;

      if (b.complete == true) {
        actions = (
          <a href="#" className="booking-complete-button">
            Booked!
          </a>
        )
      } else {
        actions = (
          <a href="#" onClick={self.cancelBookingFn(b)}>
            Cancel
          </a>
        )
      }

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
                Near {b.address}
              </span>
            </p>
          </div>

          <div className="booking--actions">
            {actions}
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
        <LoadingOverlay isVisible={this.state.isLoading} />

        <div className="container">
          <h2 className="page-subtitle">Upcoming</h2>
          <div className="card list-page-content">
            {this.renderUpcomingBookings()}
          </div>
        </div>
      </div>
    )
  }
});
