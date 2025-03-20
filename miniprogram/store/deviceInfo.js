//用来获取设备信息，目前仅实现获取ESP32音量、电量、聊天历史
import { observable, action } from 'mobx-miniprogram';

export const deviceInfoStore = observable({
  // 定义一个响应式状态来存储 options 数据
  deviceOptions: null,

  // 定义一个 action 来更新 deviceOptions 状态
  setDeviceOptions: action(function(options) {
    this.deviceOptions = options;
  })
});