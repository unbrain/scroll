
<template>
  <div id="app">
    <div class="buttons">
      <button @click="length++">增加1条</button>
      <button @click="length+=10">增加10条</button>
      <button @click="length > 0 && length--">减少1条</button>
      <button @click="scrollTop+=10">向下滚动10px</button>
      <button @click="scrollTop > 0 && (scrollTop-=10)">向上滚动10px</button>
    </div>
    <div>当前Top: {{scrollTop}}</div>
    <div class="container">
      <happy-scroll
        size="6"
        :min-length-v="0.15"
        left
        :scroll-left.sync="scrollLeft"
        :scroll-top.sync="scrollTop"
        bigger-move-h="end"
        smaller-move-h="end"
        @vertical-start="start"
        @vertical-end="end"
        color="rgba(79, 192, 141, .7)"
        resize
      >
        <ul class="text-box">
          <li v-for="index in length" :key="index">{{text[index % text.length]}}</li>
        </ul>
      </happy-scroll>
    </div>
  </div>
</template>

<script>
import { HappyScroll } from "vue-happy-scroll";

export default {
  name: "app",
  components: {
    "happy-scroll": HappyScroll
  },
  props: {
    scrollbar: {
      // 开启滚动条fade 为 true 表示当滚动停止的时候滚动条是否需要渐隐，interactive 表示滚动条是否可以交互。
      type: Object,
      default: function() {
        return {
          fade: false,
          interactive: true
        };
      }
    },
    data: null
  },
  data() {
    return {
      hideHorizontal: true,
      length: 12,
      scrollTop: 0,
      scrollLeft: 0,
      text: [
        "卑鄙是卑鄙者的通行证，",
        "高尚是高尚者的墓志铭。",
        "看吧，在那镀金的天空中，",
        "飘满了死者弯曲的倒影。",
        "冰川纪过去了，",
        "为什么到处都是冰凌？",
        "好望角发现了，",
        "为什么死海里千帆相竞？",
        "我来到这个世界上，",
        "只带着纸、绳索和身影，",
        "为了在审判之前，",
        "宣读那些被判决了的声音：",
        "告诉你吧，世界，",
        "我——不——相——信！",
        "纵使你脚下有一千名挑战者，",
        "那就把我算做第一千零一名。",
        "我不相信天是蓝的，",
        "我不相信雷的回声；",
        "我不相信梦是假的，",
        "我不相信死无报应。",
        "如果海洋注定要决堤，",
        "就让所有的苦水都注入我心中；",
        "如果陆地注定要上升，",
        "就让人类重新选择生存的峰顶。",
        "新的转机和闪闪的星斗，",
        "正在缀满没有遮拦的天空，",
        "那是五千年的象形文字，",
        "那是未来人们凝视的眼睛。",
        "🗣"
      ]
    };
  },
  methods: {
    start() {
      this.$message.success("到头部了");
    },
    end() {
      this.$message.success("到尾部了");
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  height: 100%;
  width: 100%;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  flex-direction: column;
}
.buttons {
  margin-bottom: 10px;
}
.container {
  width: 500px;
  height: 800px;
  background: #f6f6f6;
  padding: 20px;
  border: 1px solid #4fc08d;
  white-space: nowrap;
}
.text-box {
  display: inline-block;
}
.text-box > li {
  font-size: 18px;
  line-height: 28px;
  margin: 30px 0;
}
.text-box > li:nth-child(odd) {
  background-color: #eee;
}
.happy-scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.happy-scroll-strip--vertical {
  position: absolute;
  right: 0px;
  top: 0;
  height: 100%;
}
.happy-scroll-strip--vertical .happy-scroll-bar {
  background-color: rgba(51, 51, 51, 0.2);
  border-radius: 7px;
  width: 6px;
  height: 0;
  -webkit-transition: width 0.4s ease, height 0.6s ease;
  transition: width 0.4s ease, height 0.6s ease;
}
.happy-scroll-strip--horizontal {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
}
.happy-scroll-strip--horizontal .happy-scroll-bar {
  background-color: rgba(51, 51, 51, 0.2);
  border-radius: 7px;
  height: 6px;
  width: 0;
  -webkit-transition: height 0.4s ease, width 0.6s ease;
  transition: height 0.4s ease, width 0.6s ease;
}
/* 在webkit内核下将滚动条隐藏，Firefox下采用容器覆盖的机制 */
.happy-scroll-container::-webkit-scrollbar {
  display: none;
}
.happy-scroll-container {
  overflow: auto;
}

.happy-scroll-container .happy-scroll-content {
  /* 解决横向滚动差 20px 的问题 */
  display: inline-block;
}
</style>
