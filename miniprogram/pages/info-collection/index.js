import { areaList } from '@vant/area-data'
import { parseDateFn, convertNumToSex, convertModuleToString } from '../../utils/index'


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
  }
})