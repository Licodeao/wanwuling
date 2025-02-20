// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const userCollection = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const updateData = {}
    const { phone, username, avatarUrl, preference } = event

    if (username !== undefined && username !== '') {
      updateData.username = username
    }

    if (avatarUrl !== undefined && avatarUrl !== '') {
      updateData.avatarUrl = avatarUrl
    }

    if (preference) {
      const preferenceData = {}
      const { birthday, sex, mode, area, hobbies } = preference

      if (birthday !== undefined && birthday !== '') {
        preferenceData.birthday = birthday
      }

      if (sex !== undefined && sex !== '') {
        preferenceData.sex = sex
      }

      if (mode !== undefined && mode !== '') {
        preferenceData.mode = mode
      }

      if (area !== undefined && area !== '') {
        preferenceData.area = area
      }

      if (Array.isArray(hobbies) && hobbies.length > 0) {
        preferenceData.hobbies = hobbies
      }

      if (Object.keys(preferenceData).length > 0) {
        const _ = db.command
        updateData.preference = _.set(preferenceData)
      }
    }

    if (Object.keys(updateData).length > 0) {
      const result = await userCollection.where({
        phone
      }).update({
        data: updateData
      })

      return {
        code: 200,
        data: result
      }
    }
  } catch(err) {
    return {
      code: 400,
      message: '更新用户信息失败',
      error: err.message
    }
  }
}