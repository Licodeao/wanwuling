Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
    url: {
      type: String,
      value: "",
    },
  },
  methods: {
    navigateToUrl() {
      if (!this.data.url) return;
  
      wx.navigateTo({
        url: this.data.url,
      });
    },
  }
});
