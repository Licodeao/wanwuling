// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const userCollection = db.collection("user");

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { phone, uuid } = event;
    await userCollection.where({ phone }).update({ uuid });

    return {
      code: 200,
      message: "更新uuid成功",
    };
  } catch (e) {
    return {
      code: 400,
      message: "更新uuid失败",
      error: err.message,
    };
  }
};
