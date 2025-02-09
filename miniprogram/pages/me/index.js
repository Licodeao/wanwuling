Page({
  data: {
    defaultName: "未登陆"
  },
  handleLogin(e) {
    console.log(e)
    let cloudID = e.detail.cloudID
    if (!cloudID) {
      wx.showToast({
        title: '用户未授权',
      })
      return
    }
    wx.cloud.callFunction({
      name: 'getLogin',
      data: {
        phone: wx.cloud.CloudID(e.detail.cloudID)
      }
    }).then(res => {
      console.log('success', res)
    }).catch(err => {
      console.log(err)
    })
  }
})