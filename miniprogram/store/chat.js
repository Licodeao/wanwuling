// 聊天历史模块
import { observable, action } from "mobx-miniprogram";
import { setStorage, getStorage } from "../utils/index";

export const chatHistoryStore = new observable({
  // 聊天历史数据
  chatMessages: getStorage("chatMessages") || [],

  // 分页和加载状态
  loadingStatus: {
    // 是否加载更多
    hasMore: true,
    // 每页加载条数
    pageSize: 10,
    // 当前页码
    pageIndex: 1,
    // 是否正在加载
    loading: false,
    // 最后更新时间
    lastUpdateTime: 0,
  },

  // 设置聊天历史 Action
  setChatMessagesAction: action(function (data) {
    this.chatMessages = data;
    setStorage("chatMessages", data);
  }),

  // 追加聊天历史 Action
  appendChatMessagesAction: action(function (data) {
    this.chatMessages = [...this.chatMessages, ...data];
    setStorage("chatMessages", this.chatMessages);
  }),

  // 设置加载状态 Action
  setLoadingStatusAction: action(function (data) {
    this.loadingStatus = {
      ...this.loadingStatus,
      ...data,
    };
  }),

  // 切换设备时重置数据
  resetChatHistory: action(function (data) {
    this.chatMessages = [];
    this.loadingStatus = {
      hasMore: true,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      lastUpdateTime: 0,
    };
    setStorage("chatMessages", []);
  }),

  // 检查聊天数据是否更新 Action
  checkUpdateAction: action(async function (uuid) {
    if (!uuid) return false;

    try {
      const res = await wx.cloud.callFunction({
        name: "checkChatUpdate",
        data: {
          uuid,
          lastUpdateTime: this.loadingStatus.lastUpdateTime,
        },
      });

      return res.result && res.result.hasUpdate;
    } catch (e) {
      console.console.error("检查聊天更新失败", e);
      return false;
    }
  }),
});
