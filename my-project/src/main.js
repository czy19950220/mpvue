import Vue from 'vue'
import App from './App'
import store from './store/index'
import interfaces from './utils/interfaces'
import 'mpvue-weui/src/style/weui.css';

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$interfaces = interfaces;
Vue.prototype.$JsonBird = 'https://bird.ioliu.cn/v1/?url=';//用来转请求的地址，由于小程序的请求是https的，所以转一下读书神器的连接
App.mpType = 'app';


const app = new Vue(App)
app.$mount()
