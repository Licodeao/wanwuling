// 云函数入口文件
const cloud = require('wx-server-sdk')
// uuid
const { v4: uuidv4 } = require('uuid')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const userCollection = db.collection('user')

// 生成随机字符串函数
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 用户手机号在数据库中不存在时，创建一个新的用户记录；如果存在，则返回用户信息
  let { userPhone } = event

  try {
    const user = await userCollection.where({
      phone: userPhone
    }).get()

    // 用户已经存在，返回用户信息
    if (user.data.length > 0) {
      return {
        success: true,
        message: '登录成功',
        data: user.data[0]
      }
    } else {
      // 用户不存在，创建新用户
      // 生成4位字符串
      const randomString = generateRandomString(4)
      const newUser = {
        uuid: uuidv4(),
        phone: userPhone,
        username: `小灵_${randomString}`,
        createdAt: new Date()
      }

      const addUserResult = await userCollection.add({
        data: newUser
      })

      if (addUserResult && addUserResult.errMsg === 'collection.add:ok') {
        return {
          success: true,
          message: '注册成功',
          data: newUser,
        }
      }
    }
  } catch(err) {
    return {
      success: false,
      error: err.message
    }
  }
}