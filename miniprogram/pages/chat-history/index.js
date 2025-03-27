import { createStoreBindings } from "mobx-miniprogram-bindings";
import { deviceInfoStore } from "../../store/deviceInfo";
import { chatHistoryStore } from "../../store/chat";

Page({
  data: {
    messages: [],
    inputValue: "",
    currentUser: "sender1", // 当前用户
    loadingMore: false,
  },

  onLoad() {
    this.deviceStoreBindings = createStoreBindings(this, {
      store: deviceInfoStore,
      fields: ["deviceOptions"],
    });

    this.chatStoreBindings = createStoreBindings(this, {
      store: chatHistoryStore,
      fields: ["chatMessages", "loadingStatus"],
      actions: [
        "setChatMessagesAction",
        "appendChatMessagesAction",
        "setLoadingStatusAction",
        "resetChatHistory",
        "checkUpdateAction",
      ],
    });

    this.loadChatHistory(true);
  },

  onUnload() {
    this.deviceStoreBindings.destroyStoreBindings();
    this.chatStoreBindings.destroyStoreBindings();
  },

  onShow() {
    this.checkForNewMessages();
  },

  onInput(event) {
    this.setData({
      inputValue: event.detail.value,
    });
  },

  sendMessage() {
    if (this.data.inputValue.trim()) {
      const newMessage = {
        content: this.data.inputValue,
        sender: this.data.currentUser,
      };
      this.setData({
        messages: [...this.data.messages, newMessage],
        inputValue: "",
        currentUser:
          this.data.currentUser === "sender1" ? "sender2" : "sender1", // 切换发送者
      });
    }
  },

  async checkForNewMessages() {
    const uuid = this.data.deviceOptions && this.data.deviceOptions.uuid;

    if (!uuid) return;

    const hasUpdate = await this.checkUpdateAction(uuid);

    if (hasUpdate) {
      wx.showLoading({ title: "发现新消息" });
      this.loadChatHistory(true);
    }
  },

  loadChatHistory(refresh = false) {
    const uuid = this.data.deviceOptions && this.data.deviceOptions.uuid;

    if (!uuid) {
      this.setData({ messages: [] });

      wx.showToast({
        title: "请先连接设备",
        icon: "error",
        duration: 1500,
      });

      return;
    }

    if (
      this.data.loadingStatus.loading ||
      (!refresh && !this.data.loadingStatus.hasMore)
    ) {
      return;
    }

    this.setLoadingStatusAction({ loading: true });

    if (refresh) {
      this.setLoadingStatusAction({
        pageIndex: 1,
        hasMore: true,
      });

      wx.showLoading({
        title: "刷新数据中",
        mask: true,
      });
    } else {
      this.setData({ loadingMore: true });
    }

    const params = {
      uuid,
      pageSize: this.data.loadingStatus.pageSize || 10,
      pageIndex: this.data.loadingStatus.pageIndex || 1,
    };

    wx.cloud
      .callFunction({
        name: "getChatHistory",
        data: params,
      })
      .then((res) => {
        console.log("获取聊天记录成功", res);
        const result = res.result || {};

        if (result.code === 200 && result.data) {
          let chatMessages = result.data.messages || [];

          chatMessages.sort((a, b) => a.timestamp - b.timestamp);

          const currentTime = Date.now();

          if (refresh) {
            this.setChatMessagesAction(chatMessages);
          } else {
            this.appendChatMessagesAction(chatMessages);
          }

          this.setLoadingStatusAction({
            hasMore: chatMessages.length >= this.data.loadingStatus.pageSize,
            pageIndex: this.data.loadingStatus.pageIndex + 1,
            lastUpdateTime: currentTime,
          });

          console.log(
            `${refresh ? "刷新" : "加载更多"}聊天记录成功：${
              chatMessages.length
            }条`
          );
        } else {
          console.error("获取聊天记录失败", result);

          wx.showToast({
            title: result.message || "获取记录失败",
            icon: "error",
            duration: 1500,
          });
        }
      })
      .catch((err) => {
        console.error("获取聊天记录失败", err);

        wx.showToast({
          title: "网络异常，请重试",
          icon: "error",
          duration: 1500,
        });
      })
      .finally(() => {
        this.setLoadingStatusAction({ loading: false });
        this.setData({ loadingMore: false });
        wx.hideLoading();
      });
  },

  onPullDownRefresh() {
    this.loadChatHistory(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    if (this.data.loadingStatus.hasMore && !this.data.loadingStatus.loading) {
      this.loadChatHistory(false);
    }
  },

  formatTime(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    // 时分
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    if (isToday) {
      return `今天 ${timeStr}`;
    }

    // 昨天
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `昨天 ${timeStr}`;
    }

    // 一周内
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const dayDiff = Math.floor((now - date) / (24 * 60 * 60 * 1000));

    if (dayDiff < 7) {
      return `${weekdays[date.getDay()]} ${timeStr}`;
    }

    // 一年内
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    if (date.getFullYear() === now.getFullYear()) {
      return `${month}月${day}日 ${timeStr}`;
    }

    // 超过一年
    return `${date.getFullYear()}年${month}月${day}日 ${timeStr}`;
  },

  formatTimeForWxs: function (timestamp) {
    return this.formatTime(timestamp);
  },
});
