<template>
  <div @click="$emit('update:num', num+1)">click {{num}}</div>
</template>

<script>
export default {
  props: {
    num: {
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>
