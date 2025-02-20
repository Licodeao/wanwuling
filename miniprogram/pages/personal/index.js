import { areaList } from '@vant/area-data'
import { parseDateFn, convertNumToSex, convertModuleToString } from '../../utils/index'
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/user'
import { toJS } from 'mobx-miniprogram'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store: userStore,
    fields: ['userInfo', 'token'],
  },
  data: {
    areaList,
    defaultAvatar: '',
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
    sexColumns: ['男孩', '女孩', '不透露性别'],
    modeShow: false,
    modeColumns: ['趣味性','科普性'],
    locationShow: false,
    checks: []
  },
  onLoad() {
    const localUserInfo = wx.getStorageSync('userInfo')

    if (localUserInfo) {
      this.initUserInfo(localUserInfo)
    }
  },
  initUserInfo(rawUserInfo) {
    const userInfo = toJS(rawUserInfo)
    
    if (userInfo) {
      const preference = toJS(userInfo.preference || {})

      this.setData({
        defaultAvatar: userInfo.avatarUrl || '../../images/default-avatar.png',
        username: userInfo.username || '',
        birthday: preference.birthday || '',
        sex: convertNumToSex(preference.sex) || '',
        mode: convertModuleToString(preference.mode) || '',
        location: preference.area || '',
        checks: preference.hobbies || []
      }) 
    }
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
            defaultAvatar: fileID
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
  async formSubmit(e) {
    const { username, birthday, sex, mode, location} = e.detail.value
    const { defaultAvatar, checks } = this.data
    
    const updateFormData = {
      phone: this.data.userInfo.phone,
      // 使用本地图片做头像不上传
      avatarUrl: defaultAvatar === '../../images/default-avatar.png' ? '' : defaultAvatar,
      username,
      preference: Object.assign({}, {
        birthday,
        sex: convertNumToSex(sex),
        mode: convertModuleToString(mode),
        area: location || '',
        hobbies: checks
      })
    }
    console.log("更新数据: ",updateFormData)
    try {
      const res = await wx.cloud.callFunction({
        name: 'updateInfos',
        data: updateFormData
      })
      console.log('前端获取到的结果:', res)
      if (res.result.code === 200) {
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