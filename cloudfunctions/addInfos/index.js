// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const userCollection = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  let { info } = event

  try {
    await userCollection.where({
      phone: info.phone
    }).update({
      data: {
        preference: info.preference
      }
    })

    const updatedData = await userCollection.where({
      phone: info.phone
    }).get()

    return {
      code: 200,
      message: '保存成功',
      data: updatedData.data[0]
    }
  } catch(err) {
    return {
      code: 400,
      error: err.message
    }
  }
}