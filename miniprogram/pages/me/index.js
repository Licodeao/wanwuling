import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/user'

Page({
  behaviors: [storeBindingsBehavior],
  data: {
    defaultName: "立即登陆"
  },
  storeBindings: {
    store: userStore,
    fields: ['userInfo']
  },
  onLoad() {
    console.log(this.data.userInfo)
  },
  onShow() {
    this.updateUsername()
  },
  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
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