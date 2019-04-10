<template>
  <!--首页-->
  <div class="container">
    <div class="login">
      <img :src="userImg" class="user" alt="用户头像">
      <span>{{nickName}}</span>
      <div class="learn">
        <button open-type="getUserInfo" @getuserinfo="getUserInfo">获取信息</button>
      </div>
      <button @click="toRead()" class="read">阅读</button>
      <web-view src="https://lirongyao.com/api/index.php"></web-view>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        userImg: '',//用户头像
        nickName: ''//用户名
      }
    },

    components: {},

    methods: {
      getUserInfo(e) {
        //授权成功？
        if (e.mp.detail.userInfo) {
          //console.log(e.mp.detail.userInfo);
          let userData = e.mp.detail.userInfo;
          //console.log(userData)
          this.userImg = userData.avatarUrl;//头像
          this.nickName = userData.nickName;//用户名
          //存储
          this.$store.dispatch('setisAuthenicated', true);
          this.$store.dispatch('setUser', userData);
          //this.getCode();
        } else {
          console.log('没得到');
        }
      },
      getCode() {
        wx.login({
          success: res => {
            //console.log(res);
            this.getOpenid(res.code);
          }
        })
      },
      getOpenid(code){
        //三个参数appid secret code
        const appid='wxe3e43f7e121cb4c2';
        const secret='29d5133241171cf2a6e371bc9b535c88';
        wx.showLoading({
          title:'加载中...'
        });
        wx.request({
          url:`${this.$interfaces.getOpenid}/${appid}/${secret}/${code}`,
          method: "get",
          success(res){
            console.log('1'+res.data);
            wx.hideLoading();
          },
          fail(err){
            console.log('2'+err);
            wx.hideLoading();
          }
        })
      },
      toRead(){//去阅读书架
        let url='../read/main';
        wx.switchTab({url});
      }
    },

    created() {
      // let app = getApp()
    }
  }
</script>

<style scoped>
  .container, .login {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .login {
    text-align: center;
  }

  .login span {
    display: block;
    margin: 10px;
  }

  .user {
    height: 130rpx;
    width: 130rpx;
    margin: 20rpx auto;
    border-radius: 50%;
  }

  .learn button:active {
    background-color: burlywood;
    color: white;
  }
  .read{
    margin-top: 20rpx;
  }
</style>
