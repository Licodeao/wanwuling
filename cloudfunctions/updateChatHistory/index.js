// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const chatCollection = db.collection("chat");

// 云函数入口函数
exports.main = async (event, context) => {
  const { uuid, dialogues } = event;

  if (!uuid) {
    return {
      code: 400,
      message: "UUID不能为空",
    };
  }

  if (!dialogues || typeof dialogues !== "object") {
    return {
      code: 400,
      message: "对话数据格式错误",
    };
  }

  try {
    const chatRecord = await chatCollection.where({ uuid }).get();

    const currentTime = Date.now();
    const messageItems = Object.values(dialogues).map((dialog) => {
      return {
        messageId: dialog.id || `msg_${currentTime}`,
        content: dialog.text || "",
        sender: dialog.speaker || "unknown",
        timestamp: currentTime,
      };
    });

    let result;
    let statusMessage;

    if (chatRecord.data.length === 0) {
      result = await chatCollection.add({
        data: {
          uuid,
          messages: messageItems,
          createdAt: currentTime,
          updatedAt: currentTime,
        },
      });

      statusMessage = "聊天记录已入库";
    } else {
      result = await chatCollection.doc(chatRecord.data[0]._id).update({
        data: {
          messages: db.command.push(messageItems),
          updatedAt: currentTime,
        },
      });

      statusMessage = "聊天记录已更新";
    }

    return {
      code: 200,
      result,
      message: statusMessage,
    };
  } catch (err) {
    console.error("更新聊天记录失败", err);
    return {
      code: 500,
      message: "更新聊天记录失败",
    };
  }
};
