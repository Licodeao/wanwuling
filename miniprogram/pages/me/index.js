import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/user'

Page({
  behaviors: [storeBindingsBehavior],
  data: {
    defaultName: ""
  },
  storeBindings: {
    store: userStore,
    fields: ['userInfo', 'token']
  },
  onLoad() {
    this.updateUsername()
  },
  updateUsername() {
    const userInfo = this.data.userInfo
    if (userInfo && userInfo.username) {
      this.setData({
        defaultName: userInfo.username
      })
    }
  },
  navigateToPersonal() {
    wx.navigateTo({
      url: '/pages/personal/index',
    })
  }
})