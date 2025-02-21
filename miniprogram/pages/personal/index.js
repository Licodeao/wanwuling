import { areaList } from '@vant/area-data'
import { parseDateFn, convertNumToSex, convertModuleToString } from '../../utils/index'
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/user'

Page({
  data: {
    areaList,
    birthdayShow: false,
    currentDate: new Date().getTime(),
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
    sexShow: false,
    sexColumns: ['男孩', '女孩', '不透露性别'],
    modeShow: false,
    modeColumns: ['趣味性','科普性'],
    locationShow: false,
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['userInfo'],
      actions: [
        'updateUserAvatarUrlAction', 'updateUsernameAction', 'updateUserBirthdayAction', 'updateUserSexualAction',
        'updateUserModeAction',
        'updateUserAreaAction',
        'updateUserHobbiesAction'
      ]
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    if (avatarUrl) {
      wx.cloud.uploadFile({
        cloudPath: `avatars/${Date.now()}.png`,
        filePath: avatarUrl,
        success: res => {
          const fileID = res.fileID
          this.updateUserAvatarUrlAction(fileID)
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
  onBirthdayClose() {
    this.setData({
      birthdayShow: false
    })
  },
  showBirthdayPopup() {
    this.setData({
      birthdayShow: true
    })
  },
  onBirthdayConfirm(e) {
    const d = parseDateFn(e.detail)
    this.updateUserBirthdayAction(d)
    this.onBirthdayClose()
  },
  onSexClose() {
    this.setData({
      sexShow: false
    })
  },
  showSexPopup() {
    this.setData({
      sexShow: true
    })
  },
  onSexConfirm(e) {
    this.updateUserSexualAction(e.detail.value)
    this.onSexClose()
  },
  onModeClose() {
    this.setData({
      modeShow: false
    })
  },
  showModePopup() {
    this.setData({
      modeShow: true
    })
  },
  onModeConfirm(e) {
    this.updateUserModeAction(e.detail.value)
    this.onModeClose()
  },
  onLocationClose() {
    this.setData({
      locationShow: false
    })
  },
  showLocationPopup() {
    this.setData({
      locationShow: true
    })
  },
  onLocationConfirm(e) {
    this.updateUserAreaAction(e.detail.values[0].name)
    this.onLocationClose()
  },
  onCheckBoxChange(e) {
    this.updateUserHobbiesAction(e.detail)
  },
  async formSubmit(e) {
    const { username, birthday, sex, mode, area, hobbies } = e.detail.value
    
    const updateFormData = {
      phone: this.data.userInfo.phone,
      avatarUrl: this.data.userInfo.avatarUrl,
      username,
      preference: {
        birthday,
        sex,
        mode,
        area,
        hobbies
      }
    }
    console.log("更新数据: ",updateFormData)
    wx.showLoading({
      title: '更改中',
    })
    try {
      const res = await wx.cloud.callFunction({
        name: 'updateInfos',
        data: updateFormData
      })
      console.log('前端获取到的结果:', res)
      if (res.result.code === 200) {
        wx.hideLoading()
        wx.showToast({
          title: '更改成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1100)
      } else {
        wx.showToast({
          title: '更改失败',
          icon: 'error',
          duration: 1000
        })
      }
    } catch(err) {
      wx.showToast({
        title: '保存失败',
        icon: 'error'
      })
    }
  },
})