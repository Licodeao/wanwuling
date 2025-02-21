// 用户模块
import { observable, action } from 'mobx-miniprogram'
import { getStorage } from '../utils/index'

export const userStore = observable({
  // 用户信息
  userInfo: getStorage('userInfo') || {},
  // token
  token: getStorage('token') || '',

  // 更新用户信息Action
  updateUserInfoAction: action(function(data) {
    this.userInfo = data
  }),

  // 更新token Action
  updateTokenAction: action(function(data) {
    this.token = data
  }),

  // 更新用户头像Action
  updateUserAvatarUrlAction: action(function(data) {
    this.userInfo = Object.assign({}, this.userInfo, {
      avatarUrl: data
    })
  }),

  // 更新用户昵称Action
  updateUsernameAction: action(function(data) {
    this.userInfo = Object.assign({}, this.userInfo, {
      username: data
    })
  }),

  // 更新用户偏好——生日
  updateUserBirthdayAction: action(function(data) {
    this.userInfo = {
      ...this.userInfo,
      preference: {
        ...this.userInfo.preference,
        birthday: data
      }
    }
  }),

  // 更新用户偏好——性别
  updateUserSexualAction: action(function(data) {
    this.userInfo = {
      ...this.userInfo,
      preference: {
        ...this.userInfo.preference,
        sex: data
      }
    }
  }),

  // 更新用户偏好——模式
  updateUserModeAction: action(function(data) {
    this.userInfo = {
      ...this.userInfo,
      preference: {
        ...this.userInfo.preference,
        mode: data
      }
    }
  }),

  // 更新用户偏好——位置
  updateUserAreaAction: action(function(data) {
    this.userInfo = {
      ...this.userInfo,
      preference: {
        ...this.userInfo.preference,
        area: data
      }
    }
  }),

  // 更新用户偏好——兴趣爱好
  updateUserHobbiesAction: action(function(data) {
    this.userInfo = {
      ...this.userInfo,
      preference: {
        ...this.userInfo.preference,
        hobbies: data
      }
    }
  })
}, {
  deep: true
})