import { areaList } from '@vant/area-data'
import { parseDateFn, convertNumToSex, convertModuleToString } from '../../utils/index'
import { setStorage } from '../../utils/index'
import { userStore } from '../../store/user'

Page({
  data: {
    areaList,
    show: false,
    currentDate: new Date().getTime(),
    displayDate: '点击选择生日',
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
    radio: '',
    displayRadio: '请选择性别',
    moduleRadio: '',
    displayModuleRadio: '请选择模式',
    checks: [],
    areaShow: false,
    displayLocation: '点击选择位置',
    phone: '',
  },
  onLoad(options) {
    if (options.phone) {
      this.setData({
        phone: options.phone
      })
    }
  },
  showPopup() {
    this.setData({ 
      show: true,
    });
  },
  showAreaPopup() {
    this.setData({
      areaShow: true
    })
  },
  onClose() {
    this.setData({ 
      show: false,
    });
  },
  onAreaClose() {
    this.setData({
      areaShow: false
    })
  },
  onDateConfirm(e) {
    this.setData({
      currentDate: e.detail,
      displayDate: parseDateFn(new Date(e.detail))
    });
    this.onClose()
  },
  onChange(e) {
    this.setData({
      radio: e.detail,
      displayRadio: convertNumToSex(e.detail)
    });
  },
  onModuleRadioChange(e) {
    this.setData({
      moduleRadio: e.detail,
      displayModuleRadio: convertModuleToString(e.detail)
    })
  },
  onCheckBoxChange(e) {
    this.setData({
      checks: e.detail
    })
  },
  onAreaConfirm(e) {
    console.log(e.detail.values)
    this.setData({
      displayLocation: e.detail.values[0].name
    })
    this.onAreaClose()
  },
  formSubmit(e) {
    const { hobbies, mode, sex } = e.detail.value

    if (this.data.displayDate === '点击选择生日') {
      wx.showToast({
        title: '请选择生日',
        icon: 'error',
        duration: 1500
      })
      return
    }

    if (!sex) {
      wx.showToast({
        title: '请选择性别',
        icon: 'error',
        duration: 1500
      })
      return
    }

    if (!mode) {
      wx.showToast({
        title: '请选择模式',
        icon: 'error',
        duration: 1500
      })
      return
    }

    const formData = {
      phone: this.data.phone,
      preference: {
        birthday: this.data.displayDate,
        sex: convertNumToSex(sex),
        mode: convertModuleToString(mode),
        area: this.data.displayLocation === '点击选择位置' ? '' : this.data.displayLocation,
        hobbies: hobbies || [],
      }
    }
    console.log('提交表单', formData)
    wx.showLoading({
      title: '保存中',
    })
    wx.cloud.callFunction({
      name: 'addInfos',
      data: {
        info: formData
      }
    }).then(res => {
      console.log('更新结果', res)
      if (res.result.code === 200) {
        wx.hideLoading()
        setStorage('userInfo', res.result.data)
        userStore.updateUserInfoAction(res.result.data)
        wx.showToast({
          title: res.result.message,
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/me/index'
          })
        }, 1300)
      }
    }).catch(err => {
      console.log(err)
    })
  }
})