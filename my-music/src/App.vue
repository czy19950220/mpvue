<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import router from './router'

  export default {
    name: 'App',
    created(){
      router.beforeEach((to, from, next) => {
        // 开始进度条
        console.log(to,from)
        NProgress.start();
        // 继续路由
        next()
      });
      router.afterEach(transition => {
        // 结束进度条
        NProgress.done()
      });
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .el-input__suffix {
    right: 10px;
  }
</style>
