<template>
  <div class="book-content" @click="tapBook">
    <!--加载动画-->
    <mp-loading :showLoading="isShowLoading" loadingText="加载中..." mask="true"></mp-loading>
    <!--头部，返回，章节显示，设置-->
    <div v-show="showHeader" class="read-header">
      <span class="back" @click="toShelf()">{{back}}</span>
      <div class="name-chapter">
        <span class="book-name">{{chapterTitle}}</span>
      </div>
    </div>
    <!--上一章/下一章/目录-->
    <span v-show="showHeader" class="loadpre load-left" @click="loadPrev(-1)">{{back}}</span>
    <span v-show="showHeader" class="loadpre load-right" @click="loadPrev(1)">&gt;</span>
    <div class="mulu" v-show="showHeader">
      <div class="mulu-con"><mp-button @click="loadPrev(-1)" type="primary" size="normal" btnClass="mb15 mr15">上一章</mp-button></div>
      <div class="mulu-con mr"><mp-button type="primary" size="large" btnClass="mb15 mr15" @click="toChapters()">目录</mp-button></div>
      <div class="mulu-con"><mp-button @click="loadPrev(1)" type="primary" size="normal" btnClass="mb15 mr15">下一章</mp-button></div>
    </div>
    <!--小说内容-->
    <scroll-view class="book-read" scroll-y>
      <!--进度条-->
      <!--<div class="progress">
        <mp-progress id="progress" :animateMode="animateMode" :percent="percent" :animate="true"/>
      </div>-->
      <div class="read-main">
        <p :style="fontSize" class="precon" v-for="(text,index) in bodyText" v-html="text" :key="index"></p>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import mpButton from 'mpvue-weui/src/button';
  import MpProgress from 'mp-weui/packages/progress'
  import mpLoading from 'mpvue-weui/src/loading';
  import {mapGetters, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'sourceId'
      ])
    },
    components: {
      mpButton,
      MpProgress,
      mpLoading
    },
    name: "index",
    data() {
      return {
        isShowLoading:false,//加载
        showHeader:true,//头部，上/下一章
        percent: 100,//进度条进度 %
        back: '＜',//返回按钮
        bookId: '',//获取读书的id
        bookName: '书名asdasdasd',//书名
        chapterTitle: 'loading.......',//章节名
        sourceId:'',//小说源
        chapterList:[],//章节列表
        page:0,//阅读至第几章
        bodyText:'',//小说内容
        loading:false,//加载中？
        myBooks:[],//书籍存储进度
        fontSize:`font-size:28px;`,//字体大小
        animateMode:'forwards'//进度条播放模式
      }
    },
    methods: {
      ...mapActions([
        'setSourceId'
      ]),
      //目录
      toChapters(){
        //把小说源的id传过去
        this.setSourceId(this.sourceId)
        let url = '../chapters/main?id='+this.bookId+`&page=${this.page}`;
        wx.navigateTo({url});
      },
      goTop() {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 30
        })
      },
      //点击中间区域显示/隐藏头部
      tapBook(e){
        let w = wx.getSystemInfoSync().windowWidth;   // 获取当前窗口的宽度
        let h = wx.getSystemInfoSync().windowHeight;    // 获取当前窗口的高度
        let x=e.clientX||e.x;
        let y=e.clientY||e.y;
        if(x/w>0.35 && x/w<0.65 && y/h>0.30 && y/h<0.70) {
          console.log('隐藏/显示');
          this.showHeader=!this.showHeader;
        }
      },
      //返回书架
      toShelf() {
        let url = '../read/main';
        wx.redirectTo({url});
      },
      //获取小说源
      getNovel(id){
        let that=this;
        let url=`http://api.zhuishushenqi.com/toc?view=summary&book=${id}`;
        //console.log(url)
        return new Promise( (resolve, reject) => {
          wx.request({
            url: url,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.status == 200 || res.statusCode==200) {
                let data = res.data;
                let sourceId = data.length > 1 ? data[1]._id : data[0]._id;
                for (let item of data) {
                  if (item.source === 'my176') {
                    sourceId = item._id;
                    break;
                  }
                }
                that.sourceId=sourceId;
                //console.log(sourceId);
                resolve();
              }
            }
          })
        });
      },
      //获取连接
      getLink() {
        return new Promise((resolve, reject)=>{
          let url = `http://api.zhuishushenqi.com/toc/${this.sourceId}?view=chapters`;
          //console.log(url);
          let that=this;
          wx.request({
            url: url,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              //console.log(res)
              if (res.status == 200 || res.statusCode==200) {
                let chapterList = res.data;
                //console.log(chapterList)
                that.chapterList = chapterList.chapters;//章节列表
                //console.log(that.chapterList)
                that.chapterTitle = that.chapterList[that.page].title;
                resolve();
              }
            }
          })
        });
      },
      //获取章节的文本
      getText() {//http://chapter2.zhuishushenqi.com
        let selfVue=this;
        selfVue.percent=10;//进度条
        selfVue.animateMode='forwards';//进度条
        return new Promise((resolve, reject)=>{
          let chapters=selfVue.chapterList;
          let url=`http://chapter2.zhuishushenqi.com/chapter/${encodeURIComponent(chapters[selfVue.page].link)}?k=2124b73d7e2e1945&t=1468223717`;
          wx.request({
            url: url,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              //console.log(res)
              if (res.status == 200 || res.statusCode==200) {
                let data = res.data;
                if (data.ok) {
                  if (data.chapter.body.indexOf('下载最新的追书神器app阅读本作') > -1) {
                    Toast({
                      message: '资源丢失了...',
                      position: 'bottom',
                      duration: 2000
                    });
                    return;
                  }
                  if (data.chapter.body.indexOf('请安装最新版追书') > -1) {
                    Toast({
                      message: '资源丢失了...',
                      position: 'bottom',
                      duration: 2000
                    });
                    return;
                  }
                  selfVue.percent=30;
                  //把回车换成br标签
                  selfVue.bodyText = data.chapter.body.split("\n").join("<br>");//.split("\n").join("<br>")
                  var arr = selfVue.bodyText.split('<br>');
                  let newText=[];//用来存储新的text文本
                  for(var i=0;i<arr.length;i++){
                    newText.push(arr[i])
                  }
                  selfVue.percent=80;
                  selfVue.bodyText=newText;
                  selfVue.percent=100;
                  selfVue.isShowLoading=false;//加载动画off
                  selfVue.changeBookshelf()
                  //console.log(newText)
                }
              }
            }
          })
        });
      },
      //上/下一章
      loadPrev(num){
        this.goTop();
        this.animateMode='backwards';//进度条
        //this.openFullScreen();
        //console.log('loadPrev');
        this.page =this.page+num;
        if (this.page<0){
          this.page =0;
          wx.showToast({
            title: '已经是第一章了',
            icon: 'success',
            duration: 800,
            mask: true
          });
        }else if (this.page>=this.chapterList.length){
          this.page =this.chapterList.length-1;
          wx.showToast({
            title: '已经是最新章了',
            icon: 'success',
            duration: 800,
            mask: true
          });
        }else {
          this.isShowLoading=true;//加载动画on
          this.getText();
          this.chapterTitle=this.chapterList[this.page].title;
        }
      },
      //存储阅读到第几章了
      changeBookshelf(){
        let that=this,ID=this.bookId;
        wx.getStorage({
          key: 'myBooks',
          success(res) {
            //类型string转object
            let data = JSON.parse(res.data);
            let len = data.books.length;
            data.books.map((ele)=>{
              if(ele._id == ID){
                ele.lastReadChapter= that.chapterList[that.page].title;//标题
                ele.lastReadChapterIndex= that.page;//标题索引
                wx.setStorage({//存储
                  key: 'myBooks',
                  data: JSON.stringify(data)
                })
              }
            })
          }
        });
      }
    },
    create() {
      //this.getNovel(this.bookId);
    },
    onReachBottom(){
     this.showHeader = true;
    },
    onLoad: function (options) {
      this.isShowLoading=true;//加载动画on
      this.bookId = options.id;
      this.page=parseInt(options.page);
      this.getNovel(this.bookId).then(this.getLink).then(this.getText);
    },
    onLaunch: function () {
      this.getHeight(1)
    },
    getHeight: function (n) {
      var _this = this;
      wx.getSystemInfo({
        success: function (res) {
          _this.data.minscreenHeight = res.windowHeight * n
        }
      })
    },

  }
</script>

<style scoped>
  page,.book-content{
    height: 100%;
  }

  .progress {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 11;
    width: 100%;
  }

  .book-read {
    background-color: wheat;
    min-height: 100%;
    padding-top: 42px;
  }

  .read-main {
    height: 100%;
    width: calc(100% - 0px);
    clear: both;
  }

  .read-header {
    position: fixed;
    z-index: 10;
    height: 40px;
    width: 100%;
    background-color: black;
    line-height: 40px;
  }

  .read-header span {
    color: white;
    font-size: 30px;
    display: inline-block;
    height: 40px;
    margin-left: 10px;
  }

  .back {
    width: 40px;
    float: left;
  }

  .read-header .book-name {
    font-size: 12px;
  }

  .name-chapter {
    width: calc(100% - 50px);
    text-align: center;
    margin: auto;
    float: left;
    text-indent: -25px;
  }

  .precon{
    line-height: 1.5;
    display: inline-block;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: justify;
    text-indent: 2em;
    margin-bottom: 0px;
    float: left;
    padding: 0px 10px;
  }

  .loadpre{
    position: fixed;
    color: white;
    background-color: black;
    opacity: 0.4;
    top: 50%;
    text-align: center;
    font-size: 30px;
    height: 50px;
    width: 36px;
    line-height: 50px;
    z-index: 1000;
  }

  .load-right{
    right: 0px;
  }

  .load-left{
    left: 0px;
  }

  .mulu{
    z-index: 10000;
    position: fixed;
    bottom: 8px;
    left: 0;
    width: 100%;
    height: 60px;
    text-align: center;
  }

  .mulu-con{
    display: inline-block;
    width: 33.3%;
  }

</style>
