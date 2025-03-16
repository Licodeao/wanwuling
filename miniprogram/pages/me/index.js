import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/user'
import Dialog from '@vant/weapp/dialog/dialog';
import { clearStorage } from '../../utils/index'

Page({
  data: {
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['userInfo', 'token'],
      actions: [
        'updateUserInfoAction',
        'updateTokenAction'
      ]
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
  },
  handleLogout() {
    Dialog.confirm({
      title: '确认退出吗?',
    }).then(() => {
      wx.removeStorageSync('lastExpressionDate')
      clearStorage()
      this.updateUserInfoAction('')
      this.updateTokenAction('')
      wx.reLaunch({
        url: '../index/index',
      })
    }).catch(() => {
      console.log('logout cancel')
    });
  }
})