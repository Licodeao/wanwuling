import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/user'

Page({
  data: {
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['userInfo', 'token']
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  navigateToPersonal() {
    if (!this.data.token) {
      wx.navigateTo({
        url: '../../packageUser/pages/login/index',
      })
    } else {
      wx.navigateTo({
        url: '../../packageUser/pages/personal/index',
      })
    }
  },
  navigateToBluetooth() {
    wx.navigateTo({
      url: '../../packageDevice/pages/search/index',
    })
  }
})