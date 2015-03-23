global.PrimaryNavigation = React.createClass({
  getDefaultProps: function() {
    return {
      showScheduleBooking: false,
      showBackHome: false
    }
  },

  render: function() {
    var links = [];

    if (this.props.showScheduleBooking) {
      links.push(
        <a href="/new-booking">
          Schedule Booking
        </a>
      )
    }

    if (this.props.showBackHome) {
      links.push(
        <a href="/">
          Go back home
        </a>
      )
    }

    return (
      <div className="primary-navigation">
        <div className="container">
          <h1>Concierge</h1>

          <div className="primary-navigation--actions">
            {links}
          </div>
        </div>
      </div>
    )
  }

});
