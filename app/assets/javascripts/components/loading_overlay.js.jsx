global.LoadingOverlay = React.createClass({
  getDefaultProps: function() {
    return {
      isVisible: false
    }
  },

  render: function() {
    var classes = React.addons.classSet({
      'loading-overlay': true,
      'loading-overlay--is-visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        <div className="loading-overlay--animation">
          <div className="sk-spinner sk-spinner-chasing-dots">
            <div className="sk-dot1"></div>
            <div className="sk-dot2"></div>
          </div>
        </div>
      </div>
    )
  }
});
