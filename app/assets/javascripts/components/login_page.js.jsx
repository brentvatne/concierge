global.LoginPage = React.createClass({
  getInitialState: function() {
    return {
      waitingForVerifier: false,
      waitingForUserInfo: false,
      showExistingAccountForm: false,
      isLoading: false
    }
  },

  toggleVerifierInput: function(e) {
    this.setState({waitingForVerifier: true});
  },

  toggleExistingAccountForm: function(e) {
    this.setState({showExistingAccountForm: !this.state.showExistingAccountForm});    
  },

  submitExistingAccountForm: function() {
    var email = this.refs.emailInput.getDOMNode().value,
        password = this.refs.passwordInput.getDOMNode().value,
        self = this;

    this.setState({isLoading: true});

    $.post('/sessions', {email: email, password: password}).
      done(function(response) {
        if (response.success == true) {
          window.location.href = '/';
        } else {
          alert('Invalid username or password');
        }
      }).
      complete(function() {
        self.setState({isLoading: false});
      });
  },

  renderExistingAccountForm: function() {
    return (
      <form onSubmit={this.submitExistingAccountForm}>
        <p>Sign in to your Concierge account</p>
        <input key="email" type="email" ref="emailInput" placeholder="Email" />
        <input key="password" type="password" ref="passwordInput" placeholder="Password" />

        <div className="form--actions">
          <button className="medium-button">Sign in</button>
          <a className="medium-button cancel-button"
             onClick={this.toggleExistingAccountForm}>
            Cancel
          </a>
        </div>
      </form>
    )
  },

  submitVerificationCode: function(e) {
    e.preventDefault();
    var verificationCode = this.refs.verifierInput.getDOMNode().value,
        self = this;

    this.setState({isLoading: true});

    $.post('/auth', {verificationCode: verificationCode}).
      done(function(response) {
        if (response.success == true) {
          self.setState({waitingForVerifier: false, waitingForUserInfo: true});
        } else {
          alert('Hmm, that did not seem to work. Did you copy the code properly?')
        }
        self.setState({isLoading: false});
      });
  },

  submitUserInfo: function(e) {
    e.preventDefault()
    var name = this.refs.nameInput.getDOMNode().value,
        email = this.refs.emailInput.getDOMNode().value,
        phone = this.refs.phoneInput.getDOMNode().value,
        password = this.refs.passwordInput.getDOMNode().value,
        self = this;

    $.post('/users', {user: {name: name, email: email, phone: phone, password: password}}).
      done(function(response) {
        window.location.reload();
      });
  },

  render: function() {
    var action;

    if (this.state.waitingForVerifier) {
      action = (
        <form className="verifier-input-wrapper"
              onSubmit={this.submitVerificationCode}>
          <input key="verifier" type="text" ref="verifierInput"
            placeholder="Enter your verification code here" />
          <button className="big-button">
             Continue
          </button>
        </form>        
      )      
    } else if (this.state.waitingForUserInfo) {
      action = (
        <form className="user-info-input-wrapper"
              onSubmit={this.submitUserInfo}>
          <p>Great! Just fill in a few more details and we can get started.</p>

          <input key="name" type="text" ref="nameInput" placeholder="Name" />
          <input key="email" type="email" ref="emailInput" placeholder="Email" />
          <input key="phone" type="text" ref="phoneInput" placeholder="Phone" />
          <input key="password" type="password" ref="passwordInput" placeholder="Password" />

          <button className="big-button">
            Finish
          </button>
        </form>        
      )
    } else if (this.state.showExistingAccountForm) {
      action = this.renderExistingAccountForm();
    } else {
      action = (
        <div>
          <p>
            Schedule Car2Go reservations as
            far in advance as you like, so you
            know that a car will be ready for you
            when you need it.
          </p>
          <a href="/auth/new"
             onClick={this.toggleVerifierInput}
             target="_blank"
             className="big-button">
            Sign up through Car2Go
          </a>
          <p className="login-or">or</p>
          <a onClick={this.toggleExistingAccountForm}
             className="big-button alternate-button mb20">
            Sign in using an existing account
          </a> 
        </div>
      )
    }
    return (
      <div>
        <LoadingOverlay isVisible={this.state.isLoading} />
        <div className="container">
          <div className="login-box card">
            <h1>Car2Go Concierge</h1>

            {action}
          </div>
        </div>
      </div>
    )
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.waitingForVerifier === false &&
        this.state.waitingForVerifier === true) {
      $(this.refs.verifierInput.getDOMNode()).focus();
    }

    if (prevState.waitingForUserInfo === false &&
        this.state.waitingForUserInfo === true) {
      $(this.refs.nameInput.getDOMNode()).focus();
    }

    if (prevState.showExistingAccountForm === false &&
        this.state.showExistingAccountForm === true) {
      $(this.refs.emailInput.getDOMNode()).focus();
    }
  }
})
