global.NewBookingPage = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      title: '',
      date: '',
      time: '',
      address: '',
      isLoading: false
    }
  },

  submitForm: function(e) {
    e.preventDefault();
    var self = this;
    this.setState({isLoading: true});
    var data = {booking: {
      title: this.state.title, date: this.state.date, time: this.state.time,
      address: this.state.address
    }};
    $.post('/bookings', data).done(function(response) {
      if (response.success == true) {
        window.location.href = '/'
      } else {
        self.setState({isLoading: false});
        alert('Something went wrong')
      }
    }).complete(function() {
      // Problem!
    });
  },

  renderForm: function() {
    return (
      <form onSubmit={this.submitForm} className="new-booking-form">
        <input key="title" ref="titleInput" type="text"
          valueLink={this.linkState('title')}
          placeholder="Enter a description, eg: 'Visit Grandma'"/>
        <input key="date" ref="dateInput" type="text"
          valueLink={this.linkState('date')}
          placeholder="Date, eg: 'March 22' or 'January 1 2015'"/>
        <input key="time" ref="timeInput" type="text"
          valueLink={this.linkState('time')}
          placeholder="Time, eg: '5:00pm' or '17:00'"/>
        <input key="address" ref="addressInput" type="text"
          valueLink={this.linkState('address')}
          placeholder="Pickup location, eg: '123 Main Street'"/>


        <div className="form--actions">
          <button className="medium-button">Save</button>
          <a href="/" className="medium-button cancel-button">Cancel</a>
        </div>
      </form>
    )
  },

  render: function() {
    return (
      <div>
        <PrimaryNavigation showBackHome={true} />
        <LoadingOverlay isVisible={this.state.isLoading} />

        <div className="container">
          <h2 className="page-subtitle">Schedule a new booking</h2>

          <div className="card list-page-content">
            {this.renderForm()}
          </div>
        </div>
      </div>
    )
  }
});
