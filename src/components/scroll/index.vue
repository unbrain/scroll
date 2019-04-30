<template>
  <div class="scroller-wrapper" ref="wrapper">
    <div
      class="content-wrapper"
      ref="slot"
      @scroll.passive="onScrollHandle"
      @mouseenter="showBar"
      @mouseleave="yLeaveHandle"
    >
      <slot></slot>
    </div>

    <div class="y-bar-outer bar" ref="ybar">
      <div
        class="inner"
        @mousedown="yMouseDownHandle"
        :class="{move:move.yMouseDown}"
        :style="`height:${yBarHeight}px;opacity:${yBarOpa};transform:translateY(${yInnerTop}px)`"
      ></div>
    </div>
  </div>
</template>

<script>
import { getScrollBarSize, debounce, generateThrottle } from "./util.js";
import ElementResizeDetectorMaker from "element-resize-detector";

export default {
  props: {
    autoHide: {
      //滚动条自动隐藏
      type: Boolean,
      default: true
    },
    isfirst: {
      type: Boolean,
      default: true
    },
    forData: {
      type: [Array, Number],
      default: function() {
        return [];
      }
    },
    ScrollTop: {
      type: Number,
      default: 0
    },
    listenScrollBottom: {
      type: [Function, Boolean],
      default: () => {}
    },
    listenScrollTop: {
      type: [Function, Boolean],
      default: () => {}
    },
    listenScroll: {
      type: [Function, Boolean],
      default: () => {}
    }
  },

  data() {
    return {
      yBarHeight: 0, //滑块高度
      yBarOpa: 1, //滑块透明度
      yInnerTop: 0, //滑块top距离
      info: {
        // 刷新的时候才更新 减少读取 增加性能
        wrapperHeight: 0, //外容器高度
        contentHeight: 0, //内部总高度
        yBarHeight: 0 //滑轨高度
      },
      move: {
        yMouseDown: false,
        yMouseDownOffset: 0
      },
      firstTop: true,
      scrollThrottle: generateThrottle(20)
    };
  },
  created() {},
  mounted() {
    // 注册节流函数
    this.debounceHide = debounce(() => {
      // 放置在此处的判断是个妥协
      // 尽管会可读性 但是这个判断过于重要 几乎所有地方都需要达成条件才触发自动隐藏
      // 并且在外部判断 由于延时的特性会导致一些同步问题
      if (this.autoHide && !this.move.yMouseDown) {
        this.hideBar();
      }
    }, 1000);

    // 提示用户可以滚动
    if (this.autoHide) {
      this.showBar();
      this.debounceHide();
    }

    this.$nextTick(() => {
      this.refresh();
      this.resizeListener();
    });
  },
  methods: {
    resizeListener() {},
    refresh() {
      this.setContentOffset(); //-17px
      this.reGetInfo(); //获取滚动条信息

      if (this.info.contentHeight <= this.info.wrapperHeight + 1) {
        this.yBarHeight = 0;
      } else {
        this.yBarHeight =
          (this.info.wrapperHeight / this.info.contentHeight) *
          this.info.yBarHeight; //高度百分比=>滑块高度
      }
    },
    setContentOffset() {
      // 获取该设备的默认滚动条宽度 依赖这个宽度把滚动条顶出去
      let scrollBarWidth = getScrollBarSize();
      this.$refs.slot.style.marginRight = `${-scrollBarWidth}px`;
      this.$refs.slot.style.marginBottom = `${-scrollBarWidth}px`;
    },
    reGetInfo() {
      // 获取基本的宽高信息
      this.info.wrapperHeight = this.$refs.wrapper.clientHeight;
      this.info.contentHeight = this.$refs.slot.children[0].clientHeight;
      this.info.yBarHeight = this.$refs.ybar.clientHeight;
    },
    onScrollHandle() {
      //if (!this.scrollThrottle(Date.now())) return false;
      // 自动隐藏
      this.showBar();
      this.debounceHide();

      const slotScrollTop = this.$refs.slot.scrollTop;

      const yScrollPercent = slotScrollTop / this.info.contentHeight; //计算scrollTop所占容器高度百分百
      this.yInnerTop = this.info.yBarHeight * yScrollPercent; //滑块top

      this.listenScroll(slotScrollTop);
      this.$emit("update:isfirst", false);
      // 监听滚动到底部
      if (this.listenScrollBottom) {
        const bottomHeight =
          this.info.contentHeight - this.info.wrapperHeight - slotScrollTop;
        if (bottomHeight <= 0.5) {
          this.$emit("update:isfirst", true);
          this.listenScrollBottom();
        }
      }

      if (this.listenScrollTop) {
        if (slotScrollTop == 0) {
          this.$emit("update:isfirst", false);
          this.listenScrollTop();
        }
      }
    },
    showBar() {
      this.yBarOpa = 1;
    },
    hideBar() {
      this.yBarOpa = 0;
    },
    yMouseDownHandle(e) {
      const eventScreenY = e.screenY;
      this.move.yMouseDown = true;
      this.move.yMouseDownOffset = eventScreenY;

      this.showBar();

      const moveHandle = e => {
        e.preventDefault();
        // 计算出Y轴偏移和缩放比例 让content进行滚动
        const moveScreenY = e.screenY;
        let offsetY = moveScreenY - this.move.yMouseDownOffset;
        this.move.yMouseDownOffset = moveScreenY;
        let scale = this.info.contentHeight / this.info.yBarHeight;
        let contentOffset = offsetY * scale;
        this.$refs.slot.scrollTop += contentOffset;
      };

      document.addEventListener("mousemove", moveHandle);

      document.addEventListener("mouseup", e => {
        // 清除监听 重设默认值
        // 自动隐藏
        document.removeEventListener("mousemove", moveHandle);
        this.move.yMouseDown = false;
        this.move.yMouseDownOffset = 0;
        this.debounceHide();
      });
    },
    yLeaveHandle() {
      if (!this.move.yMouseDown) {
        this.debounceHide();
      }
    }
  },
  watch: {
    forData(newVal) {
      this.$nextTick(() => {
        this.refresh();
      });
    },
    ScrollTop(newVal) {
      this.$refs.slot.scrollTop = newVal;
    }
  }
};
</script>

<style lang="less" scoped="scoped">
.scroller-wrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
  .content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-right: -15px;
    margin-bottom: -15px;
    overflow: scroll;
  }
  .y-bar-outer {
    position: absolute;
    width: 6px;
    transition: opacity 200ms ease 0s;
    opacity: 1;
    right: 0px;
    bottom: 0px;
    top: 0px;
    border-radius: 0px;
    .inner {
      position: relative;
      display: block;
      width: 100%;
      cursor: pointer;
      border-radius: inherit;
      background-color: rgba(82, 85, 91, 0.8);
      border-radius: 4px;
      transition: opacity 0.4s ease, height 0.6s ease;
    }
  }
  .bar {
    .inner {
      &:hover {
        background-color: rgba(82, 85, 91, 1);
      }
      &.move {
        background-color: rgba(82, 85, 91, 1);
      }
    }
  }
}
</style>
