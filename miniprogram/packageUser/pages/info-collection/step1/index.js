import { parseDateFn, convertNumToSex } from '../../../../utils/index'
import { userStore } from '../../../../store/user'
import { createStoreBindings } from 'mobx-miniprogram-bindings'

Page({
  data: {
    avatarUrl: '',
    username: '',
    gender: '',
    show: false,
    currentDate: new Date().getTime(),
    displayDate: '',
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`
      }
      return value;
    },
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['userInfo'],
      actions: [
        'updateUserAvatarUrlAction', 'updateUsernameAction', 'updateUserBirthdayAction', 'updateUserSexualAction',
      ]
    })
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    if (avatarUrl) {
      wx.showLoading({
        title: '上传中',
      })

      wx.cloud.uploadFile({
        cloudPath: `avatars/${Date.now()}.png`,
        filePath: avatarUrl,
        success: res => {
          const fileID = res.fileID
          this.setData({
            avatarUrl: fileID
          })
          this.updateUserAvatarUrlAction(fileID)
          wx.hideLoading()
        },
        fail: err => {
          console.error('上传头像失败：', err)
          wx.showToast({
            title: '上传头像失败',
            icon: 'error',
            duration: 1500
          })
        }
      })
    }
  },

  onUsernameChange(e) {
    this.setData({
      username: e.detail
    })
    this.updateUsernameAction(e.detail)
  },

  onUsernameReview(e) {
    const { pass } = e.detail

    if (!pass) {
      wx.showToast({
        title: '请重新填写昵称',
        icon: 'error',
        duration: 1500
      })
      this.updateUsernameAction('')
    }
  },

  onGenderSelect(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({
      gender
    })
    this.updateUserSexualAction(convertNumToSex(gender))
  },

  navigateToStepTwo() {
    if (this.data.username === '') {
      wx.showToast({
        title: '请填写昵称呀',
        icon: 'error',
        duration: 1100
      })
      return
    }

    if (this.data.displayDate === '') {
      wx.showToast({
        title: '请选择生日呀',
        icon: 'error',
        duration: 1100
      })
      return
    }

    if (this.data.gender === '') {
      wx.showToast({
        title: '请选择性别呀',
        icon: 'error',
        duration: 1100
      })
      return
    }

    wx.navigateTo({
      url: '../step2/index',
    })
  },

  showPopup() {
    this.setData({ 
      show: true,
    });
  },

  onClose() {
    this.setData({ 
      show: false,
    });
  },

  onDateConfirm(e) {
    this.setData({
      currentDate: e.detail,
      displayDate: parseDateFn(new Date(e.detail))
    });
    this.updateUserBirthdayAction(parseDateFn(new Date(e.detail)))
    this.onClose()
  }
})