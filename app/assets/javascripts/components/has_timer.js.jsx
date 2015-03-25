global.HasTimer = {
  componentWillMount: function() {
    this.intervals = [];
  },

  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },

  componentWillUnmount: function() {
    this.clearIntervals();
  },

  clearIntervals: function() {
    this.intervals.map(clearInterval);
  }
}
