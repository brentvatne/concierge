global.ListPage = React.createClass({
  mixins: [HasTimer],

  getInitialState: function() {
    return {
      upcomingBookings: this.props.upcomingBookings,
      pastBookings: [],
      isLoading: false,
      view: 'upcoming'
    }
  },

  componentDidMount: function() {
    this.loadBookings();
    this.setInterval(this.loadBookings, 45000);
  },

  showPastBookings: function() {
    this.setState({view: 'past'});
  },

  showUpcomingBookings: function() {
    this.setState({view: 'upcoming'});
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

  loadBookings: function() {
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
          location = (<span>Near {b.address}</span>),
          badge;

      if (b.inProgress == true && b.complete == false) {
        badge = (
          <span className="in-progress-badge">Searching...</span>
        )
      }

      if (b.complete == true) {
        actions = (
          <BookingCompleteButton bookingId={b.id} stage={self.state.view} onDelete={self.cancelBookingFn(b)}/>
        )

        location = (
          <span className="booked-location">
            <span className="booked-location--label">
            <span className="booked-license-plate">{b.carLicensePlate}</span> at </span>
            <a href={"https://www.google.ca/maps/dir//" + b.carAddress}
               className="booked-location--address" target="_blank">
              {b.carAddress}
            </a>
          </span>
        )
      } else if (b.complete == false) {
        actions = (
          <BookingPendingButton bookingId={b.id} stage={self.state.view} onDelete={self.cancelBookingFn(b)} />
        )
      }

      list.push(
        <div className="booking">
          <div className="booking--info">
            <h2>{b.title}{badge}</h2>
            <p className="booking--info--date-time">
              <span className="time">
                {b.time}
              </span>

              <span>, </span>

              <span className="date">
                {b.day}, {b.date}
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
