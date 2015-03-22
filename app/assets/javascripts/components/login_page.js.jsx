global.LoginPage = React.createClass({
  getInitialState: function() {
    return {
      waitingForVerifier: false
    }
  },

  toggleVerifierInput: function() {
    this.setState({waitingForVerifier: true});
  },

  submitVerificationCode: function() {
    var verificationCode = this.refs.verifierInput.getDOMNode().value;
    // TODO: handle errors, right now assuming that it cannot fail
    $.post('/auth', {verificationCode: verificationCode}).
      done(function(response) {
        debugger
      });
  },

  render: function() {
    var action;

    if (this.state.waitingForVerifier) {
      action = (
        <form className="verifier-input-wrapper"
              onSubmit={this.submitVerificationCode}>
          <img src="http://url.brentvatne.ca/dCaF.png" /> 
          <input type="text" ref="verifierInput"
            placeholder="Enter your verification code here" />
          <a className="big-button">
             Finish
          </a>
        </form>        
      )      
    } else {
      action = (
        <div>
          <p>
            Schedule Car2Go reservations as
            far in advance as you like, so you
            know that a car will be ready for you
            when you need it.
          </p>
          <a href={this.props.authorizationUrl}
             onClick={this.toggleVerifierInput}
             target="_blank"
             className="big-button">
            Sign in through Car2Go
          </a>
        </div>
      )
    }
    return (
      <div className="login-box card">
        <h1>Car2Go Concierge</h1>

        {action}
      </div>
    )
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.waitingForVerifier === false &&
        this.state.waitingForVerifier === true) {
      $(this.refs.verifierInput.getDOMNode()).focus();
    }
  }
})
