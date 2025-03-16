import { createStoreBindings } from "mobx-miniprogram-bindings";
import { userStore } from "../../../../store/user";
import { setStorage } from "../../../../utils/index";

Page({
  data: {
    funAll: false,
    socialAll: false,
    worldAll: false,
    funChecks: [
      {
        id: 0,
        checked: false,
        title: "明星八卦与绯闻",
        desc: "",
      },
      {
        id: 1,
        checked: false,
        title: "成人向影视娱乐资讯",
        desc: "",
      },
      {
        id: 2,
        checked: false,
        title: "恐怖类神话故事",
        desc: "(替换为成语版寓言)",
      },
      {
        id: 3,
        checked: false,
        title: "暴力游戏相关内容自然灾害详细过程",
        desc: "",
      },
    ],
    socialChecks: [
      {
        id: 0,
        checked: false,
        title: "宗教节日文化背景",
        desc: "(如圣诞节->冬日礼物节)",
      },
      {
        id: 1,
        checked: false,
        title: "政治敏感话题",
        desc: "",
      },
      {
        id: 2,
        checked: false,
        title: "成人向社交话题",
        desc: "(如婚姻、职场压力)",
      },
      {
        id: 3,
        checked: false,
        title: "争议性社会事件",
        desc: "(如战争、犯罪)",
      },
    ],
    worldChecks: [
      {
        id: 0,
        checked: false,
        title: "恐怖类神话故事",
        desc: "(替换为成语版寓言)",
      },
      {
        id: 1,
        checked: false,
        title: "成人向八卦绯闻与影视娱乐资讯",
        desc: "(改为科学家、名人励志成长故事)",
        isSpecial: true,
      },
      {
        id: 2,
        checked: false,
        title: "超出年龄认知的抽象概念",
        desc: "(如物理术语、哲学理论)",
      },
    ],
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ["userInfo"],
      actions: [
        "updateUserKnowledgeFunAction",
        "updateUserKnowledgeSocialAction",
        "updateUserKnowledgeWorldAction",
      ],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onFunAllChange(e) {
    const checked = e.detail;
    const funChecks = this.data.funChecks.map((item) => ({
      ...item,
      checked: checked,
    }));

    this.setData({
      funAll: checked,
      funChecks,
    });
  },

  onFunItemChange(e) {
    const index = e.currentTarget.dataset.index;
    const checked = e.detail;
    const funChecks = [...this.data.funChecks];
    funChecks[index].checked = checked;

    const funAll = funChecks.every((item) => item.checked);

    this.setData({
      funChecks,
      funAll,
    });
  },

  onSocialAllChange(e) {
    const checked = e.detail;
    const socialChecks = this.data.socialChecks.map((item) => ({
      ...item,
      checked: checked,
    }));

    this.setData({
      socialAll: checked,
      socialChecks,
    });
  },

  onSocialItemChange(e) {
    const index = e.currentTarget.dataset.index;
    const checked = e.detail;
    const socialChecks = [...this.data.socialChecks];
    socialChecks[index].checked = checked;

    const socialAll = socialChecks.every((item) => item.checked);

    this.setData({
      socialChecks,
      socialAll,
    });
  },

  onWorldAllChange(e) {
    const checked = e.detail;
    const worldChecks = this.data.worldChecks.map((item) => ({
      ...item,
      checked: checked,
    }));

    this.setData({
      worldAll: checked,
      worldChecks,
    });
  },

  onWorldItemChange(e) {
    const index = e.currentTarget.dataset.index;
    const checked = e.detail;
    const worldChecks = [...this.data.worldChecks];
    worldChecks[index].checked = checked;

    const worldAll = worldChecks.every((item) => item.checked);

    this.setData({
      worldChecks,
      worldAll,
    });
  },

  onFunAllToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const newChecked = !this.data.funAll;
    const funChecks = this.data.funChecks.map((item) => ({
      ...item,
      checked: newChecked,
    }));

    this.setData({
      funAll: newChecked,
      funChecks,
    });
  },

  onSocialAllToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const newChecked = !this.data.socialAll;
    const socialChecks = this.data.socialChecks.map((item) => ({
      ...item,
      checked: newChecked,
    }));

    this.setData({
      socialAll: newChecked,
      socialChecks,
    });
  },

  onWorldAllToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const newChecked = !this.data.worldAll;
    const worldChecks = this.data.worldChecks.map((item) => ({
      ...item,
      checked: newChecked,
    }));

    this.setData({
      worldAll: newChecked,
      worldChecks,
    });
  },

  onFunItemToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const index = e.currentTarget.dataset.index;
    const funChecks = [...this.data.funChecks];
    funChecks[index].checked = !funChecks[index].checked;

    const funAll = funChecks.every((item) => item.checked);

    this.setData({
      funChecks,
      funAll,
    });
  },

  onSocialItemToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const index = e.currentTarget.dataset.index;
    const socialChecks = [...this.data.socialChecks];
    socialChecks[index].checked = !socialChecks[index].checked;

    const socialAll = socialChecks.every((item) => item.checked);

    this.setData({
      socialChecks,
      socialAll,
    });
  },

  onWorldItemToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const index = e.currentTarget.dataset.index;
    const worldChecks = [...this.data.worldChecks];
    worldChecks[index].checked = !worldChecks[index].checked;

    const worldAll = worldChecks.every((item) => item.checked);

    this.setData({
      worldChecks,
      worldAll,
    });
  },

  // 阻止冒泡事件(空方法)
  catchTapEvent() {},

  navigateBackToPrevious() {
    wx.navigateBack({
      delta: 1,
    });
  },

  navigateToNextPage() {
    const hasFunSelected = this.data.funChecks.some((item) => item.checked);
    const hasSocialSelected = this.data.socialChecks.some(
      (item) => item.checked
    );
    const hasWorldSelected = this.data.worldChecks.some((item) => item.checked);

    if (!hasFunSelected || !hasSocialSelected || !hasWorldSelected) {
      wx.showToast({
        title: "请设置范围呀",
        icon: "error",
        duration: 1100,
      });
      return;
    }

    const selectedFun = this.data.funChecks.filter((item) => item.checked);
    const selectedSocial = this.data.socialChecks.filter(
      (item) => item.checked
    );
    const selectedWorld = this.data.worldChecks.filter((item) => item.checked);

    this.updateUserKnowledgeFunAction(selectedFun);
    this.updateUserKnowledgeSocialAction(selectedSocial);
    this.updateUserKnowledgeWorldAction(selectedWorld);

    wx.nextTick(() => {
      const formData = {
        phone: this.data.userInfo.phone,
        avatarUrl: this.data.userInfo.avatarUrl,
        username: this.data.userInfo.username,
        preference: this.data.userInfo.preference,
        knowledge: this.data.userInfo.knowledge,
      };
      console.log("提交表单", formData);

      wx.showLoading({
        title: "保存中",
      });

      wx.cloud
        .callFunction({
          name: "addInfos",
          data: {
            info: formData,
          },
        })
        .then((res) => {
          console.log("更新结果", res);
          if (res.result.code === 200) {
            wx.hideLoading();
            setStorage("userInfo", res.result.data);
            userStore.updateUserInfoAction(res.result.data);
            wx.showToast({
              title: res.result.message,
              icon: "success",
              duration: 1000,
            });
            setTimeout(() => {
              wx.reLaunch({
                url: "../../../../pages/me/index",
              });
            }, 1200);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
});
