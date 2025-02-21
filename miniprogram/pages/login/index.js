import { userStore } from '../../store/user'
import { setStorage } from '../../utils/index'

Page({
  data: {
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

    wx.showLoading({
      title: '登录中'
    })
    
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'phonenumber.getPhoneNumber',
        body: {
          code
        }
      }
    }).then(res => {
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
            setStorage('userInfo', dbRes.result.data.userInfo)
            setStorage('token', dbRes.result.data.token)
            userStore.updateUserInfoAction(dbRes.result.data.userInfo)
            userStore.updateTokenAction(dbRes.result.data.token)
            wx.showToast({
              icon: 'success',
              title: dbRes.result.message,
              duration: 1000,
              success: function() {
                setTimeout(() => {
                  if (dbRes.result.data.isNewUser) {
                    wx.navigateTo({
                      url: `/pages/info-collection/index?phone=${purePhoneNumber}`,
                    })
                  } else {
                    wx.reLaunch({
                      url: '/pages/me/index',
                    })
                  }
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