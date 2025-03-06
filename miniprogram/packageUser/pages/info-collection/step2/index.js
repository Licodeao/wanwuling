import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { userStore } from '../../../../store/user'
import { areaList } from '@vant/area-data'
import { convertModuleToString } from '../../../../utils/index'

Page({
  data: {
    mode: '',
    areaShow: false,
    areaList,
    displayLocation: '',
    hobbies: [],
    selectedHobbies: [false, false, false, false, false, false]
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['userInfo'],
      actions: [
        'updateUserModeAction',
        'updateUserAreaAction',
        'updateUserHobbiesAction'
      ]
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  onModeSelect(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ mode })
    this.updateUserModeAction(convertModuleToString(mode))
  },
  onAreaClose() {
    this.setData({
      areaShow: false
    })
  },
  onAreaConfirm(e) {
    this.setData({
      displayLocation: e.detail.values[0].name
    })
    this.updateUserAreaAction(e.detail.values[0].name)
    this.onAreaClose()
  },
  showAreaPopup() {
    this.setData({
      areaShow: true
    })
  },
  onHobbySelect(e) {
    const { index, hobby } = e.currentTarget.dataset
    const selectedHobbies = [...this.data.selectedHobbies]
    const hobbies = [...this.data.hobbies]

    selectedHobbies[index] = !selectedHobbies[index]

    if (selectedHobbies[index]) {
      hobbies.push(hobby)
    } else {
      const hobbyIndex = hobbies.indexOf(hobby)
      if (hobbyIndex > -1) {
        hobbies.splice(hobbyIndex, 1)
      }
    }

    this.setData({
      selectedHobbies, 
      hobbies
    })
    
    this.updateUserHobbiesAction(hobbies)
  },

  navigateBackToPrevious() {
    wx.navigateBack({
      delta: 1
    })
  },
  
  navigateToNextPage() {
    if (this.data.mode === '') {
      wx.showToast({
        title: '请选择模式呀',
        icon: 'error',
        duration: 1100
      })
      return
    }

    wx.navigateTo({
      url: '../step3/index',
    })
  }
})