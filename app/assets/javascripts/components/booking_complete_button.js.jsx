global.BookingCompleteButton = React.createClass({
  getInitialState: function() {
    return {
      menuIsOpen: false,
      isLoading: false
    }
  },

  toggleMenu: function(e) {
    e.preventDefault();
    this.setState({menuIsOpen: !this.state.menuIsOpen})
  },

  cancelReservation: function() {
    this.setState({isLoading: true});
    $.post('/bookings/' + this.props.bookingId + '/cancel', {}).complete(function() {
      window.location.reload();
    })
  },

  deleteBooking: function(e) {
    this.setState({isLoading: true});
    this.props.onDelete(e);
  },

  render: function() {
    var self = this,
        cx = React.addons.classSet,
        action,
        optionsListClasses = cx({'link-options-list': true,
                                 'active': this.state.menuIsOpen});

     if (this.props.stage == 'upcoming') {
       action = (
         <a href="#" onClick={self.cancelReservation}>Cancel reservation</a>
       )
     } else {
       action = (
        <a href="#" onClick={self.deleteBooking}>Done, delete this</a>
       )
     }

    return (
      <div>
        <LoadingOverlay isVisible={this.state.isLoading} />
        <a href="#" ref="root" className="link-with-options booking-complete-button">
          Booked!
          <span ref="menuToggle" className="link-options orange" onClick={this.toggleMenu}>
            <span className="caret"></span>
          </span>
        </a>

        <div className={optionsListClasses}>
          {action}
        </div>
      </div>
    )
  }
});
