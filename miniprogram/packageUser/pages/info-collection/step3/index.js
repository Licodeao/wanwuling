import { createStoreBindings } from "mobx-miniprogram-bindings";
import { userStore } from "../../../../store/user";

Page({
  data: {
    scienceAll: false,
    scienceChecks: [
      {
        id: 0,
        checked: false,
        title: "动物血腥行为",
        desc: "(如狮子捕杀斑马)",
      },
      {
        id: 1,
        checked: false,
        title: "人体隐私部位科普",
        desc: '(改为"身体安全保护教育")',
      },
      {
        id: 2,
        checked: false,
        title: "争议历史事件",
        desc: "(如哥白尼被处决、历史人物被砍头)",
      },
      {
        id: 3,
        checked: false,
        title: "自然灾害详细过程",
        desc: "(如火山喷发、地震破坏)",
      },
    ],
    languageAll: false,
    languageChecks: [
      {
        id: 0,
        checked: false,
        title: "脏话/负面情绪词",
        desc: "(根据《青少年敏感词库》v3.1)",
      },
      {
        id: 1,
        checked: false,
        title: "中英混杂表达",
        desc: "(开启后强制纯中文输出)",
      },
      {
        id: 2,
        checked: false,
        title: "超出年龄认知的抽象概念",
        desc: "(如物理术语、哲学理论)",
      },
      {
        id: 3,
        checked: false,
        title: "网络流行语",
        desc: "(如“躺平”“内卷”)",
      },
    ],
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ["userInfo"],
      actions: [
        "updateUserKnowledgeScienceAction",
        "updateUserKnowledgeLanguageAction",
      ],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onScienceAllChange(e) {
    const checked = e.detail;
    const scienceChecks = this.data.scienceChecks.map((item) => ({
      ...item,
      checked: checked,
    }));

    this.setData({
      scienceAll: checked,
      scienceChecks,
    });
  },

  onScienceItemChange(e) {
    const index = e.currentTarget.dataset.index;
    const checked = e.detail;
    const scienceChecks = [...this.data.scienceChecks];
    scienceChecks[index].checked = checked;

    const scienceAll = scienceChecks.every((item) => item.checked);

    this.setData({
      scienceChecks,
      scienceAll,
    });
  },

  onLanguageAllChange(e) {
    const checked = e.detail;
    const languageChecks = this.data.languageChecks.map((item) => ({
      ...item,
      checked: checked,
    }));

    this.setData({
      languageAll: checked,
      languageChecks,
    });
  },

  onLanguageItemChange(e) {
    const index = e.currentTarget.dataset.index;
    const checked = e.detail;
    const languageChecks = [...this.data.languageChecks];
    languageChecks[index].checked = checked;

    const languageAll = languageChecks.every((item) => item.checked);

    this.setData({
      languageChecks,
      languageAll,
    });
  },

  onScienceAllToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const newChecked = !this.data.scienceAll;
    const scienceChecks = this.data.scienceChecks.map((item) => ({
      ...item,
      checked: newChecked,
    }));

    this.setData({
      scienceAll: newChecked,
      scienceChecks,
    });
  },

  onLanguageAllToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const newChecked = !this.data.languageAll;
    const languageChecks = this.data.languageChecks.map((item) => ({
      ...item,
      checked: newChecked,
    }));

    this.setData({
      languageAll: newChecked,
      languageChecks,
    });
  },

  onScienceItemToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const index = e.currentTarget.dataset.index;
    const scienceChecks = [...this.data.scienceChecks];
    scienceChecks[index].checked = !scienceChecks[index].checked;

    const scienceAll = scienceChecks.every((item) => item.checked);

    this.setData({
      scienceChecks,
      scienceAll,
    });
  },

  onLanguageItemToggle(e) {
    if (e.target && e.target.dataset && e.target.dataset.type === "checkbox") {
      return;
    }

    const index = e.currentTarget.dataset.index;
    const languageChecks = [...this.data.languageChecks];
    languageChecks[index].checked = !languageChecks[index].checked;

    const languageAll = languageChecks.every((item) => item.checked);

    this.setData({
      languageChecks,
      languageAll,
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
    const hasSelectedScience = this.data.scienceChecks.some(
      (item) => item.checked
    );
    const hasSelectedLanguage = this.data.languageChecks.some(
      (item) => item.checked
    );

    if (!hasSelectedScience || !hasSelectedLanguage) {
      wx.showToast({
        title: "请设置范围呀",
        icon: "error",
        duration: 1100,
      });
      return;
    }

    const selectedScience = this.data.scienceChecks.filter(
      (item) => item.checked
    );
    const selectedLanguage = this.data.languageChecks.filter(
      (item) => item.checked
    );

    this.updateUserKnowledgeScienceAction(selectedScience);
    this.updateUserKnowledgeLanguageAction(selectedLanguage);

    wx.navigateTo({
      url: "../step4/index",
    });
  },
});
