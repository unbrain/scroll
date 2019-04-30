<template>
  <div class="scroller-wrapper" ref="wrapper">
    <div class="content-wrapper" ref="slot" @scroll="scroll">
      <slot></slot>
    </div>
    <div class="y-bar-outer bar" ref="ybar">
      <div
        class="inner"
        :style="`height:${lBarHeight}px;opacity:${lBarOpa};transform:translateY(${lInnerTop}px)`"
      ></div>
    </div>
  </div>
</template>

<script>
import { getScrollBarSize, debounce, generateThrottle } from "./util.js";
export default {
  props: {
    isbig: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lBarHeight: 50,
      lBarOpa: 0.8,
      lInnerTop: undefined
    };
  },
  watch: {
    isbig() {
      this.initBar();
      this.scrollToBottom();
    },
    lInnerTop(nv) {
      if (nv === 0) {
        this.$emit("top", true);
        let oldheight = this.$refs.slot.scrollHeight;
        this.$nextTick(() => {
          this.$refs.slot.scrollTop = this.$refs.slot.scrollHeight - oldheight;
          this.initBar();
        });
      }
    }
  },
  mounted() {
    this.initBar();
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      this.$refs.slot.scrollTop = this.$refs.slot.scrollHeight;
    },
    initBar() {
      this.lBarHeight =
        (this.$refs.slot.clientHeight / this.$refs.slot.scrollHeight) *
        this.$refs.slot.clientHeight;
    },
    scroll() {
      this.lInnerTop =
        (this.$refs.slot.scrollTop / this.$refs.slot.scrollHeight) *
        this.$refs.slot.clientHeight;
    }
  }
};
</script>

<style lang="postcss">
ul,
li {
  margin: 0;
  margin-bottom: 20px;
  padding: 0;
}
.scroller-wrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
}
.content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 撑开原生滚动条 */
  margin-right: -17px;
  overflow-y: scroll;
}
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
.y-bar-outer {
  position: absolute;
  width: 6px;
  transition: opacity 200ms ease 0s;
  opacity: 1;
  right: 0px;
  bottom: 0px;
  top: 0px;
  border-radius: 4px;
}
.bar {
  border-radius: 4px;
}
.inner {
  &:hover {
    background-color: rgba(82, 85, 91, 1);
  }
  &.move {
    background-color: rgba(82, 85, 91, 1);
  }
}
</style>
