global.ListPage = React.createClass({
  getInitialState: function() {
    return {
      upcomingBookings: [],
      pastBookings: [],
      isLoading: false,
      view: 'upcoming'
    }
  },

  showPastBookings: function() {
    this.setState({view: 'past'});
  },

  showUpcomingBookings: function() {
    this.setState({view: 'upcoming'});
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

    $.get('/bookings/past', function(response) {
      self.setState({pastBookings: response})
    })
  },

  renderBookings: function(bookings) {
    var list = [], self = this;

    if (bookings == 0) {
      return (<p className="empty-list-notification">No {this.state.view} bookings!</p>)
    }

    bookings.forEach(function(b) {
      var actions,
          location = (<span>Near {b.address}</span>);

      if (b.complete == true) {
        actions = (
          <a href="#" className="booking-complete-button">
            Booked!
          </a>
        )

        location = (
          <span className="booked-location">
            <span className="booked-location--label">
            <strong>{b.carLicensePlate}</strong> </span>
            <strong className="booked-location--address">
              {b.carAddress}
            </strong>
          </span>
        )
      } else if (b.complete == false && self.state.view == 'upcoming') {
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
              <span>{location}</span>
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
    var cx = React.addons.classSet, bookings,
        upcomingClasses = cx({'page-subtitle--link': true,
                              'active': this.state.view == 'upcoming'}),
        pastClasses = cx({'page-subtitle--link': true,
                          'active': this.state.view == 'past'});

    if (this.state.view == 'upcoming') {
      bookings = this.state.upcomingBookings;
    } else {
      bookings = this.state.pastBookings;
    }

    return (
      <div>
        <PrimaryNavigation showBookNow={true} showScheduleBooking={true} />
        <LoadingOverlay isVisible={this.state.isLoading} />

        <div className="container">
          <h2 className="page-subtitle">
            <a href="#" className={upcomingClasses}
               onClick={this.showUpcomingBookings}>Upcoming</a>

             <a href="#" className={pastClasses}
               onClick={this.showPastBookings}>Past</a>
          </h2>
          <div className="card list-page-content">
            {this.renderBookings(bookings)}
          </div>
        </div>
      </div>
    )
  }
});
