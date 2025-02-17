import { userStore } from '../../store/user'

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
  // 手机号登录函数
  loginByPhone(e) {
    let code = e.detail.code

    if (!code) {
      wx.showToast({
        title: '用户未授权',
        icon: 'error',
        duration: 1000
      })
      return
    }

    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'phonenumber.getPhoneNumber',
        body: {
          code
        }
      }
    }).then(res => {
      wx.showLoading({
        title: '登录中'
      })
      if (res.result && res.result.phoneInfo) {
        let { purePhoneNumber } = res.result.phoneInfo
        wx.cloud.callFunction({
          name: 'login',
          data: {
            userPhone: purePhoneNumber
          }
        }).then(dbRes => {
          console.log(dbRes)
          if (dbRes.result && dbRes.result.data) {
            wx.hideLoading()
            wx.setStorageSync('userInfo', dbRes.result.data)
            userStore.updateUserInfo(dbRes.result.data)
            wx.showToast({
              icon: 'success',
              title: dbRes.result.message,
              duration: 1000,
              success: function() {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1300)
              }
            })
          }
        }).catch(dbErr => {
          console.log(dbErr)
        })
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'error',
          duration: 1000
        })
      }
    }).catch(err => {
      console.log(err)
    })
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