Page({
  data: {
    defaultName: "立即登陆"
  },
  onShow() {
    this.updateUsername()
  },
  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  handleToDevicePage() {
    wx.navigateTo({
      url: '/pages/device/index',
    })
  },
  updateUsername() {
    const { username } = wx.getStorageSync('userInfo')
    if (username) {
      this.setData({
        defaultName: username
      })
    }
  }
})