global.BookingPendingButton = React.createClass({
  mixins: [HasDropMenu],

  getInitialState: function() {
    return {
      isLoading: false
    }
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
        <a href="#" ref="root" className="link-with-options"
           onClick={this.toggleMenu}>
          {this.props.stage == 'upcoming' ? "Pending" : "Failed"}
          <span ref="menuToggle" className="link-options grey">
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
