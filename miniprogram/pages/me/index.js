import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/user'

Page({
  behaviors: [storeBindingsBehavior],
  data: {
    defaultName: '',
    defaultAvatar: ''
  },
  storeBindings: {
    store: userStore,
    fields: ['userInfo', 'token']
  },
  onLoad() {
    this.updateInfo()
  },
  updateInfo() {
    const userInfo = this.data.userInfo
    if (userInfo) {
      this.setData({
        defaultName: userInfo.username,
        defaultAvatar: userInfo.avatarUrl || '../../images/default-avatar.png'
      })
    }
  },
  navigateToPersonal() {
    wx.navigateTo({
      url: '/pages/personal/index',
    })
  }
})