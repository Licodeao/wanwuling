// 用户模块
import { observable, action } from "mobx-miniprogram";
import { getStorage } from "../utils/index";

export const userStore = observable(
  {
    // 用户信息
    userInfo: getStorage("userInfo") || {},
    // token
    token: getStorage("token") || "",

    // 更新用户信息Action
    updateUserInfoAction: action(function (data) {
      this.userInfo = data;
    }),

    // 更新token Action
    updateTokenAction: action(function (data) {
      this.token = data;
    }),

    // 更新用户头像Action
    updateUserAvatarUrlAction: action(function (data) {
      this.userInfo = Object.assign({}, this.userInfo, {
        avatarUrl: data,
      });
    }),

    // 更新用户昵称Action
    updateUsernameAction: action(function (data) {
      this.userInfo = Object.assign({}, this.userInfo, {
        username: data,
      });
    }),

    // 更新用户uuid Action
    updateUserUuidAction: action(function (data) {
      this.userInfo = Object.assign({}, this.userInfo, {
        uuid: data,
      });
    }),

    // 更新用户偏好——生日
    updateUserBirthdayAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        preference: {
          ...this.userInfo.preference,
          birthday: data,
        },
      };
    }),

    // 更新用户偏好——性别
    updateUserSexualAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        preference: {
          ...this.userInfo.preference,
          sex: data,
        },
      };
    }),

    // 更新用户偏好——模式
    updateUserModeAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        preference: {
          ...this.userInfo.preference,
          mode: data,
        },
      };
    }),

    // 更新用户偏好——位置
    updateUserAreaAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        preference: {
          ...this.userInfo.preference,
          area: data,
        },
      };
    }),

    // 更新用户偏好——兴趣爱好
    updateUserHobbiesAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        preference: {
          ...this.userInfo.preference,
          hobbies: data,
        },
      };
    }),

    // 更新用户知识范围——科学知识
    updateUserKnowledgeScienceAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        knowledge: {
          ...this.userInfo.knowledge,
          science: data,
        },
      };
    }),

    // 更新用户知识范围——语言防火墙
    updateUserKnowledgeLanguageAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        knowledge: {
          ...this.userInfo.knowledge,
          language: data,
        },
      };
    }),

    // 更新用户知识范围——娱乐内容
    updateUserKnowledgeFunAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        knowledge: {
          ...this.userInfo.knowledge,
          fun: data,
        },
      };
    }),

    // 更新用户知识范围——社会与文化
    updateUserKnowledgeSocialAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        knowledge: {
          ...this.userInfo.knowledge,
          social: data,
        },
      };
    }),

    // 更新用户知识范围——世界观
    updateUserKnowledgeWorldAction: action(function (data) {
      this.userInfo = {
        ...this.userInfo,
        knowledge: {
          ...this.userInfo.knowledge,
          world: data,
        },
      };
    }),
  },
  {
    deep: true,
  }
);
