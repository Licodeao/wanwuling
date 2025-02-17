// 用户模块
import { observable, action } from 'mobx-miniprogram'

export const userStore = observable({
  // 用户信息
  userInfo: wx.getStorageSync('userInfo') || null,

  // 更新用户信息Action
  updateUserInfo: action(function(data) {
    this.userInfo = data
  })
})