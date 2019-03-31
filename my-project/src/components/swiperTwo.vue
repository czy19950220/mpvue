<template>
  <div class="page">
    <div class="page__bd page__bd_spacing">
      <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration"
              :circular="circular" @change="swiperChange" @animationfinish="animationfinish">
        <div v-for="item in imgUrls" :key="index">
          <swiper-item>
            {{item}}
            <image :src="item" class="slide-image"/>
          </swiper-item>
        </div>
      </swiper>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        indicatorDots: false,//是否显示面板指示点
        autoplay: false,//是否自动切换
        interval: 5000,//自动切换时间间隔
        duration: 200,//滑动动画时长
        circular: false,//是否采用衔接滑动
        imgUrls: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ]
      }
    },
    methods: {
      swiperChange(e) {
        console.log('第' + e.mp.detail.current + '张轮播图发生了滑动');
      },
      animationfinish(e) {
        console.log('第' + e.mp.detail.current + '张轮播图滑动结束');
      }
    }
  }
</script>

<style>
  .slide-image {
    width: 100%;
    height: 100%;
  }
</style>
