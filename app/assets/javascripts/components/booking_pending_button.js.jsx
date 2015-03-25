global.BookingPendingButton = React.createClass({
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

  deleteBooking: function(e) {
    this.setState({isLoading: true});
    this.props.onDelete(e);
  },

  editBooking: function(e) {
    e.preventDefault()
    this.setState({isLoading: true});
    window.location.href = "/bookings/" + this.props.bookingId + "/edit"
  },

  render: function() {
    var self = this,
        cx = React.addons.classSet,
        editLink,
        optionsListClasses = cx({'link-options-list': true,
                                 'active': this.state.menuIsOpen});

    if (this.props.stage == "upcoming") {
      editLink = (
        <a href="#" onClick={self.editBooking}>Edit this</a>
      )
    }

    return (
      <div>
        <LoadingOverlay isVisible={this.state.isLoading} />
        <a href="#" ref="root" className="link-with-options">
          {this.props.stage == 'upcoming' ? "Pending" : "Failed"}
          <span ref="menuToggle" className="link-options grey" onClick={this.toggleMenu}>
            <span className="caret"></span>
          </span>
        </a>

        <div className={optionsListClasses}>
          {editLink}
          <a href="#" onClick={self.deleteBooking}>Delete this</a>
        </div>
      </div>
    )
  }
});
