global.PrimaryNavigation = React.createClass({
  getDefaultProps: function() {
    return {
      extraClasses: '',
      showScheduleBooking: false,
      showBackHome: false
    }
  },

  render: function() {
    var links = [];

    if (this.props.showBookNow) {
      links.push(<BookNowButton key="book-now-button" />)
    }

    if (this.props.showScheduleBooking) {
      links.push(
        <a href="/new-booking" className="blue" key="schedule-for-later-link">
          Schedule for later
        </a>
      )
    }

    if (this.props.showBackHome) {
      links.push(
        <a href="/" className="go-home-link" key="go-home-link">
          Go back home
        </a>
      )
    }

    return (
      <div className={"primary-navigation " + this.props.extraClasses}>
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
