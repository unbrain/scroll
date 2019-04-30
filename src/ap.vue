<template>
  <div id="app">
    <bscroll class="wrap" ref="wrap" :isbig.sync="big" @top="top">
      <ul ref="list">
        <li v-for="(item, index) in text" :key="index">{{item}}</li>
      </ul>
    </bscroll>

    <div class="buttons">
      <button @click="plus">增加1条</button>
      <button @click="length+=10">增加10条</button>
      <button @click="length > 0 && length--">减少1条</button>
      <button @click="scrollTop+=10">向下滚动10px</button>
      <button @click="scrollTop > 0 && (scrollTop-=10)">向上滚动10px</button>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import bscroll from "@/components/scroll/lscroll";
const ease = {
  // easeOutQuint
  swipe: {
    style: "cubic-bezier(0.23, 1, 0.32, 1)",
    fn: function(t) {
      return 1 + --t * t * t * t * t;
    }
  },
  // easeOutQuard
  swipeBounce: {
    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    fn: function(t) {
      return t * (2 - t);
    }
  },
  // easeOutQuart
  bounce: {
    style: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    fn: function(t) {
      return 1 - --t * t * t * t;
    }
  }
};
export default {
  name: "app",
  components: {
    bscroll
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
      big: false,
      mouseWheel: true,
      scrollbarFade: true,
      pullDownRefresh: true,
      pullDownRefreshThreshold: 90,
      pullDownRefreshStop: 40,
      pullUpLoad: true,
      pullUpLoadThreshold: 0,
      startY: 0,
      scrollToX: 0,
      scrollToY: -200,
      scrollToTime: 700,
      scrollToEasing: "bounce",
      scrollToEasingOptions: ["bounce", "swipe", "swipeBounce"],
      items: [],
      itemIndex: 0,
      scroll: "",
      num: 0,
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
    top() {
      this.text.unshift(
        "好望角发现了，",
        "为什么死海里千帆相竞？",
        "我来到这个世界上，",
        "只带着纸、绳索和身影，",
        "我——不——相——信！",
        "纵使你脚下有一千名挑战者，",
        "那就把我算做第一千零一名。",
        "我不相信天是蓝的，",
        "正在缀满没有遮拦的天空，",
        "那是五千年的象形文字，",
        "那是未来人们凝视的眼睛。"
      );
    },
    pip() {},
    start(offset) {
      console.log("到头部了");
    },
    end(offset) {
      console.log("到尾部了");
    },
    plus() {
      this.text.push(this.text[Math.floor(Math.random() * 12)]);
      this.$nextTick(() => {
        this.big = !this.big;
      });
    },
    addItems(count = 1) {}
  },
  mounted() {
    this.$nextTick(() => {});
  }
};
</script>

<style>
.wrap {
  margin-top: 10vh;
  width: 80vw;
  height: 40vh;
  overflow: hidden;
}
.buttons {
  position: absolute;
  bottom: 20vh;
}
</style>
