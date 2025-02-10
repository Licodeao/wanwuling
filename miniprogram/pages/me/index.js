Page({
  data: {
    defaultName: "立即登陆"
  },
  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  }
})