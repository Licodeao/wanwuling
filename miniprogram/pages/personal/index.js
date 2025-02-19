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
    hobbies: '',
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
    hobbiesShow: false,
    hobbiesColumns: ['自然科学','动物世界','中华历史','工程技术','艺术培养','运动健康']
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
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
  onHobbiesClose() {
    this.setData({
      hobbiesShow: false
    })
  },
  showHobbiesPopup() {
    this.setData({
      hobbiesShow: true
    })
  },
  onHobbiesConfirm(e) {
    this.setData({
      hobbies: e.detail.value
    })

    this.onHobbiesClose()
  }
})