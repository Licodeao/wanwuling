var xBlufi = require("../../utils/blufi/xBlufi");
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { setStorage, getStorage } from '../../utils/index';
import { extractKeyValuePairs } from '../../utils/index';
import { deviceInfoStore } from '../../store/deviceInfo'; // 引入 store
import { debounce } from '../../utils/index';

Page({
  data: {
    currentExpression: '../../images/expression1.png',
    expressionList: [
      '../../images/expression1.png',
      '../../images/expression2.png',
      '../../images/expression3.png',
      '../../images/expression4.png'
    ],
    lastExpressionDate: '',
    expressionStyle: '',
    sound: 4
  },

  onLoad() {
    xBlufi.listenDeviceMsgEvent(true, this.funListenDeviceMsgEvent);
    // 手动调用方式 后续可以通过this.data.userInfo访问到store中的数据了
		this.storeBindings = createStoreBindings(this, {
			store: deviceInfoStore, // 将userStore绑定到当前页面
      fields: ['deviceOptions'], // 将userStore中的userInfo和token映射到当前页面
      actions: ['setDeviceOptions']
		})
    // 初始化时从 store 获取数据
    this.setData({
      deviceOptions: deviceInfoStore.deviceOptions,
    });
    this.updateExpression()
    this.debouncedNotifySendCustomData = debounce(xBlufi.notifySendCustomData, 3000);
  },

  onShow() {
    this.updateExpression()
  },

  onReady() {
    const { screenHeight } = wx.getWindowInfo()

    let expressionStyle = ''

    if (screenHeight > 800) {
      expressionStyle = 'top: 54%'
    } else if (screenHeight >= 730) {
      expressionStyle = 'top: 45%'
    } else if (screenHeight >= 600) {
      expressionStyle = 'top: 45%'
    } else {
      expressionStyle = 'top: 43%'
    }

    this.setData({ expressionStyle })
  },

  onUnload: function () {
    xBlufi.listenDeviceMsgEvent(false, this.funListenDeviceMsgEvent);
    // 手动销毁，防止内存泄露
    this.storeBindings.destroyStoreBindings()
  },

  funListenDeviceMsgEvent: function (options) {
    // console.log("收到设备发来的自定义数据结果xxxxxxx：", (options.data))
    if(typeof options.data === 'string'){
      // 更新 store 中的 deviceOptions 状态
      console.log("收到设备发来的自定义数据结果---：", (options.data))
      let result = extractKeyValuePairs(options.data);
      console.log("特殊打印" + result.battery);
      this.setDeviceOptions(result);
    }
  },

  updateExpression() {
    const today = new Date().toDateString()
    const lastDate = getStorage('lastExpressionDate') || ''
    
    // 如果日期变了，或者没有存储过日期，就更换表情
    if (today !== lastDate) {

      const currentIndex = this.data.expressionList.indexOf(this.data.currentExpression)
      
      // 生成一个不同于当前表情的随机索引
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * this.data.expressionList.length)
      } while (randomIndex === currentIndex && this.data.expressionList.length > 1)
      
      this.setData({
        currentExpression: this.data.expressionList[randomIndex]
      })

      setStorage('lastExpressionDate', today)
    }
  },

  changeSound(e) {
    const type = e.currentTarget.dataset.type

    let sound = this.data.sound

    if (type === 'sub') {
      if (sound <= 1) {
        wx.showToast({
          title: '音量已经最小啦',
          icon: 'error',
          duration: 1000
        })
        return
      }
      sound = sound - 1
       //发送音量给蓝牙
      this.debouncedNotifySendCustomData({
        customData: String(sound),
      })
    } else if (type === 'plus') {
      if (sound >= 5) {
        wx.showToast({
          title: '音量已经最大啦',
          icon: 'error',
          duration: 1000
        })
        return
      }
      sound = sound + 1
      //发送音量给蓝牙
      this.debouncedNotifySendCustomData({
        customData: String(sound),
      })
    }
    
    this.setData({ sound })
  },

  Search() {
    wx.navigateTo({
      url: '../../packageDevice/pages/search/index?connectbluetooth=true',
    });
  }


});
