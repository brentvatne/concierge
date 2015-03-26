global.HasDropMenu = {
  getInitialState: function() {
    return {
      menuIsOpen: false
    }
  },

  componentDidMount: function() {
    $('body').on('click', this.clickOuter);
  },

  componentWillUnmount: function() {
    $('body').off('click', this.clickOuter);
  },

  clickOuter: function(e) {
    var root = this.refs.root.getDOMNode();
    if (! $.contains(root, e.target)) {
      this.setState({menuIsOpen: false});
    }
  },

  toggleMenu: function(e) {
    e.preventDefault();
    this.setState({menuIsOpen: !this.state.menuIsOpen})
  }
}
