// pages/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoImgUrl: '',
    skeletonLoading: true
  },

  onLoad() {
    this.getImageTempUrl()
  },

  // 获取云存储中logo的临时路径
  getImageTempUrl() {
    wx.cloud.getTempFileURL({
      fileList: ['cloud://wanwuling-5gxoy7il47baaafa.7761-wanwuling-5gxoy7il47baaafa-1341042436/WechatIMG2038.jpg'],
      success: res => {
        const fileList = res.fileList
        if (fileList.length > 0 && fileList[0].status === 0) {
          const tempFileURL = fileList[0].tempFileURL
          this.setData({
            logoImgUrl: tempFileURL
          })
          this.setData({
            skeletonLoading: false
          })
        } else {
          console.error('获取临时路径失败:', fileList[0].errMsg)
        }
      },
      fail: err => {
        console.error('获取图片临时路径失败', err)
      }
    })
  },

  // 跳转到不同的协议页面
  navigateToProtocol(e) {
    const type = e.currentTarget.dataset.type;
    switch(type) {
      case 'privacy':
        wx.navigateTo({
          url: '/pages/privacy/index',
        })
      break;
      case 'service':
        wx.navigateTo({
          url: '/pages/service/index',
        })
      break;
      default:
        break;
    }
  }
})