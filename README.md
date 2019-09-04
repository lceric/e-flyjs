> 抛物线动画
# 用法
```bash
# install
npm i --save e-flyjs
```
```html
<template>
  <div class="fly-demo">
    <div class="list">
      <div class="list-item" @click="flyRun" v-for="i in 50" :key="i">
        项{{i}}s
      </div>
    </div>
    <div id="tar" class="tar">目标</div>
    <span id="dot" class="dot"></span>
  </div>
</template>
<script>
import Fly from 'e-flyjs'
export default {
  name: 'Fly_demo',
  methods: {
    flyRun(e) {
      const $tar = document.querySelector('#tar')
      const $dot = document.querySelector('#dot')
      let flyInstance = new Fly({
        el: e.target, // 触发的元素
        targetEl: $tar, // 目标元素
        flyEl: $dot, // 飞行的元素，可不传
        duration: 600,
        stop: function() {
          flyInstance = null
        },
      })
      flyInstance.start()
    }
  }
}
</script>
<style scoped>
  .fly-demo {
    position: relative;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    width: 20vw;
  }
  .list-item {
    width: 60px;
    height: 60px;
    color: #787878;
    text-align: center;
    line-height: 60px;
    border-radius: 60px;
    background: #d7e1ff;
    /* transition: all 3s linear; */
    will-change: auto;
    transition-timing-function: cubic-bezier(0.16, 0.72, 0.90, 0.22);
  }
  .tar {
    position: fixed;
    right: 10px;
    bottom: 20vh;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px solid #787878;
  }
  .dot {
    position: fixed;
    opacity: 0;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: #f00;
  }
</style>
```