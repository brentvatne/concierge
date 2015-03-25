global.PrimaryNavigation = React.createClass({
  getDefaultProps: function() {
    return {
      showScheduleBooking: false,
      showBackHome: false
    }
  },

  render: function() {
    var links = [];

    if (this.props.showBookNow) {
      links.push(<BookNowButton />)
    }

    if (this.props.showScheduleBooking) {
      links.push(
        <a href="/new-booking" className="blue">
          Schedule for later
        </a>
      )
    }

    if (this.props.showBackHome) {
      links.push(
        <a href="/" className="go-home-link">
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
