// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const chatCollection = db.collection("chat");

// 云函数入口函数
exports.main = async (event, context) => {
  const { uuid, pageSize = 10, pageIndex = 1 } = event;

  if (!uuid) {
    return {
      code: 400,
      message: "请先绑定设备!",
      data: null,
    };
  }

  try {
    const skipCount = (pageIndex - 1) * pageSize;

    const countResult = await chatCollection.where({ uuid }).count();

    if (countResult.total === 0) {
      return {
        code: 200,
        message: "暂无聊天记录",
        data: {
          messages: [],
          total: 0,
          pageIndex,
          pageSize,
        },
      };
    }

    const chatRecord = await chatCollection.where({ uuid }).get();

    let allMessages = [];
    let updatedAt = Date.now();

    if (chatRecord.data.length > 0) {
      allMessages = chatRecord.data[0].messages || [];
      updatedAt = chatRecord.data[0].updatedAt || Date.now();
    }

    const totalMessages = allMessages.length;

    allMessages.sort((a, b) => b.timestamp - a.timestamp);

    const paginatedMessages = allMessages.slice(
      skipCount,
      skipCount + pageSize
    );

    paginatedMessages.sort((a, b) => a.timestamp - b.timestamp);

    return {
      code: 200,
      message: "获取聊天记录成功",
      data: {
        messages: paginatedMessages,
        total: totalMessages,
        hasMore: skipCount + pageSize < totalMessages,
        pageIndex,
        pageSize,
        updatedAt,
      },
    };
  } catch (err) {
    console.error("获取聊天记录失败", err);
    return {
      code: 500,
      message: "获取聊天记录失败",
      data: null,
    };
  }
};
