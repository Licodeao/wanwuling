Page({
  data: {
    messages: [
      {content:"嘿，机器人，你叫什么名字呀？", sender: "sender2"},
      {content:"我叫小美，是一个超级聪明的 AI 机器人哦！你叫什么名字呢，小朋友？", sender: "sender1"},
      {content:"我叫明明。你会做什么呀？", sender: "sender2"},
      {content:"我会很多事情呢！比如回答你的问题、陪你聊天、讲有趣的故事，还可以和你一起玩游戏哦。你想要我做些什么呢？", sender: "sender1"},
      {content:"哇，好厉害！那你可以给我讲个故事吗？", sender: "sender2"},
      {content:"当然可以呀！你想听什么类型的故事呢？有童话故事、冒险故事，还有科幻故事哦。", sender: "sender1"},
      {content:"我想听童话故事。", sender: "sender2"},
      {content:"那你会不会唱歌呀？", sender: "sender2"},
      {content:"会呀！你想听什么歌呢？有儿歌、流行歌，还有很多动画片的主题曲哦。", sender: "sender1"},
      {content:"那你就唱一首儿歌吧。", sender: "sender2"},
      {content:"好的呀，那我就唱一首《两只老虎》给你听哦。“两只老虎，两只老虎，跑得快，跑得快，一只没有耳朵，一只没有尾巴，真奇怪，真奇怪", sender: "sender1"},
    ],
    inputValue: '',
    currentUser: 'sender1' // 当前用户
  },

  onInput(event) {
    this.setData({
      inputValue: event.detail.value
    });
  },

  sendMessage() {
    if (this.data.inputValue.trim()) {
      const newMessage = {
        content: this.data.inputValue,
        sender: this.data.currentUser
      };
      this.setData({
        messages: [...this.data.messages, newMessage],
        inputValue: '',
        currentUser: this.data.currentUser === 'sender1' ? 'sender2' : 'sender1' // 切换发送者
      });
    }
  }
});
