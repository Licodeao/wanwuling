import { setStorage, getStorage } from '../../utils/index'

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
    electricity: 100,
    sound: 5
  },

  onLoad() {
    this.updateExpression()
  },

  onShow() {
    this.updateExpression()
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
    }
    
    this.setData({
      sound
    })
  }
});
