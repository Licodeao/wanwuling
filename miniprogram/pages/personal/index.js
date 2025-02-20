import { areaList } from '@vant/area-data'
import { parseDateFn, convertNumToSex, convertModuleToString } from '../../utils/index'

Page({
  data: {
    areaList,
    avatarUrl: '../../images/default-avatar.png',
    username: '',
    birthday: '',
    sex: '',
    mode: '',
    location: '',
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
    sexColumns: ['男', '女', '不透露性别'],
    modeShow: false,
    modeColumns: ['趣味性','科普性'],
    locationShow: false,
    checks: []
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    if (avatarUrl) {
      wx.cloud.uploadFile({
        cloudPath: `avatars/${Date.now()}.png`,
        filePath: avatarUrl,
        success: res => {
          const fileID = res.fileID
          this.setData({
            avatarUrl: fileID
          })
        },
        fail: err => {
          console.log('上传头像失败：', err)
          wx.showToast({
            title: '上传头像失败',
            icon: 'error',
            duration: 1500
          })
        }
      })
    }
    this.setData({
      avatarUrl,
    })
  },
  onUsernameBlur(e) {
    this.setData({
      username: e.detail.value
    })
  },
  onUsernameReview(e) {
    const { pass } = e.detail

    if (!pass) {
      wx.showToast({
        title: '请重新填写昵称',
        icon: 'error',
        duration: 1500
      })
      this.setData({
        username: ''
      })
    }
  },
  formSubmit(e) {
    console.log(e.detail.value)
    const { username, birthday, sex, mode, location} = e.detail.value
    console.log('头像', this.data.avatarUrl)
    console.log('兴趣爱好', this.data.checks)
    const updateFormData = {
      avatarUrl,
      username,
      birthday,
      sex,
      mode,
      location: location || '',
      hobbies: this.data.checks
    }
    console.log(updateFormData)
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
    this.setData({
      birthday: d
    })
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
    this.setData({
      sex: e.detail.value
    })
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
    this.setData({
      mode: e.detail.value
    })
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
    this.setData({
      location: e.detail.values[0].name
    })
    this.onLocationClose()
  },
  onCheckBoxChange(e) {
    this.setData({
      checks: e.detail
    })
  },
})