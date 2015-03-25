global.BookingForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getDefaultProps: function() {
    return { booking: {} }
  },

  getInitialState: function() {
    var booking = this.props.booking;

    return {
      title: booking.title || '',
      date: booking.date || '',
      time: booking.time || '',
      address: booking.address || ''
    }
  },

  submit: function(e) {
    e.preventDefault(); 

    var booking = {
      title: this.state.title, date: this.state.date,
      time: this.state.time, address: this.state.address
    };

    this.props.onSubmit(booking);
  },

  render: function() {
    return (
      <form onSubmit={this.submit} className="new-booking-form">
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
          placeholder="Desired location: '123 Main St, Vancouver' - include the city!"/>


        <div className="form--actions">
          <button className="medium-button">Save</button>
          <a href="/" className="medium-button cancel-button">Cancel</a>
        </div>
      </form>
    )
  }
});
