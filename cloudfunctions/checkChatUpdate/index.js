// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const chatCollection = db.collection("chat");

// 云函数入口函数
exports.main = async (event, context) => {
  const { uuid, lastUpdateTime } = event;

  if (!uuid) {
    return {
      code: 400,
      message: "UUID不能为空",
      hasUpdate: false,
    };
  }

  try {
    const result = await chatCollection
      .where({
        uuid,
        updatedAt: db.command.gt(lastUpdateTime || 0),
      })
      .count();

    return {
      code: 200,
      hasUpdate: result.total > 0,
      message: "检查聊天更新成功",
    };
  } catch (e) {
    console.error("检查聊天更新失败", e);

    return {
      code: 500,
      message: "检查聊天更新失败",
      hasUpdate: false,
    };
  }
};
