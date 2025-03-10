import { areaList } from '@vant/area-data'
import { parseDateFn } from '../../../utils/index'
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { userStore } from '../../../store/user'

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
    selectedHobbies: [false, false, false, false, false, false],
    hobbiesMap: {
      0: 'nature',
      1: 'animal',
      2: 'history',
      3: 'engineer',
      4: 'art',
      5: 'sport'
    }
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['userInfo'],
      actions: [
        'updateUserAvatarUrlAction', 
        'updateUsernameAction', 
        'updateUserBirthdayAction', 
        'updateUserSexualAction',
        'updateUserModeAction',
        'updateUserAreaAction',
        'updateUserHobbiesAction'
      ]
    })

    wx.nextTick(() => {
      this.updateHobbiesStatus()
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    if (avatarUrl) {
      wx.showLoading({
        title: '上传中'
      })

      const userIdentifier = this.data.userInfo && this.data.userInfo.phone ? this.data.userInfo.phone : `temp_${Date.now()}`

      const cloudPath = `avatars/${userIdentifier}.png`

      wx.cloud.uploadFile({
        cloudPath,
        filePath: avatarUrl,
        success: res => {
          const fileID = res.fileID
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
  onHobbySelect(e) {
    const { index, hobby } = e.currentTarget.dataset
    const selectedHobbies = [...this.data.selectedHobbies]

    let hobbies = []

    if (this.data.userInfo && this.data.userInfo.preference && this.data.userInfo.preference.hobbies) {
      hobbies = [...this.data.userInfo.preference.hobbies]
    }

    selectedHobbies[index] = !selectedHobbies[index]

    if (selectedHobbies[index]) {
      hobbies.push(hobby)
    } else {
      const hobbyIndex = hobbies.indexOf(hobby)
      if (hobbyIndex > -1) {
        hobbies.splice(hobbyIndex, 1)
      }
    }

    this.setData({ selectedHobbies })
    
    this.updateUserHobbiesAction(hobbies)
  },
  updateHobbiesStatus() {
    if (!this.data.userInfo) {
      return
    }
     
    if (!this.data.userInfo.preference) {
      this.data.userInfo.preference = {}
    }
    
    if (!this.data.userInfo.preference.hobbies) {
      this.data.userInfo.preference.hobbies = []
    }
    
    const hobbies = this.data.userInfo.preference.hobbies

    const selectedHobbies = this.data.selectedHobbies.map((_, index) => {
      const hobby = this.data.hobbiesMap[index]
      return hobbies.indexOf(hobby) > -1
    })
    
    this.setData({
      selectedHobbies
    })
  },
  async formSubmit(e) {
    const { username, birthday, sex, mode, area } = e.detail.value
    
    const hobbies = this.data.userInfo && this.data.userInfo.preference && this.data.userInfo.preference.hobbies || []

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