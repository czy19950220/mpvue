<template>
  <div class="book-content" @click="tapBook">
    <scroll-view class="book-read" scroll-y>
      <!--进度条-->
      <div class="progress">
        <mp-progress id="progress" :percent="percent" :animate="true"/>
      </div>
      <!--头部，返回，章节显示，设置-->
      <div v-show="showHeader" class="read-header">
        <span class="back" @click="toShelf()">{{back}}</span>
        <div class="name-chapter">
          <span class="book-name">{{chapterTitle}}</span>
        </div>
      </div>
      <div class="read-main">
        <view class="precon" v-for="(text,index) in bodyText" v-text="text" :key="index"></view>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import mpButton from 'mpvue-weui/src/button';
  import MpProgress from 'mp-weui/packages/progress'
  import swiperTwo from '../../components/swiperTwo'

  export default {
    components: {
      mpButton,
      MpProgress,
      swiperTwo
    },
    name: "index",
    data() {
      return {
        showHeader:true,
        percent: 100,//进度条进度 %
        back: '＜',//返回按钮
        bookId: '',//获取读书的id
        bookName: '书名asdasdasd',//书名
        chapterTitle: 'loading.......',//章节名
        sourceId:'',//小说源
        chapterList:[],//章节列表
        page:0,//阅读至第几章
        bodyText:''//小说内容
      }
    },
    methods: {
      //点击中间区域显示/隐藏头部
      tapBook(e){
        let w = wx.getSystemInfoSync().windowWidth;   // 获取当前窗口的宽度
        let h = wx.getSystemInfoSync().windowHeight;    // 获取当前窗口的高度
        let x=e.clientX||e.x;
        let y=e.clientY||e.y;
        if(x/w>0.35 && x/w<0.65 && y/h>0.30 && y/h<0.70) {
          console.log(1);
          this.showHeader=!this.showHeader;
        }
      },
      //返回书架
      toShelf() {
        let url = '../read/main';
        wx.reLaunch({url});
      },
      //获取小说源
      getNovel(id){
        let that=this;
        let url=`http://api.zhuishushenqi.com/toc?view=summary&book=${id}`;
        console.log(url)
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
                console.log(sourceId);
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
          console.log(url);
          let that=this;
          wx.request({
            url: url,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)
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
        return new Promise((resolve, reject)=>{
          let chapters=selfVue.chapterList;
          let url=`http://chapter2.zhuishushenqi.com/chapter/${encodeURIComponent(chapters[selfVue.page].link)}?k=2124b73d7e2e1945&t=1468223717`;
          wx.request({
            url: url,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)
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
                  //把回车换成br标签
                  selfVue.bodyText = data.chapter.body.split("\n").join("<br>");//.split("\n").join("<br>")
                  var arr = selfVue.bodyText.split('<br>');
                  let newText=[];//用来存储新的text文本
                  for(var i=0;i<arr.length;i++){
                    newText.push(arr[i])
                  }
                  selfVue.bodyText=newText;
                  //console.log(newText)
                }
              }
            }
          })
        });
      }
    },
    create() {
      //this.getNovel(this.bookId);
    },
    onLoad: function (options) {
      //console.log(options.id)
      this.bookId = options.id;
      this.getNovel(this.bookId).then(this.getLink).then(this.getText);
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
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
    text-indent: 2em;
    margin-bottom: 0px;
    float: left;
    padding: 0rpx 0.5em;
  }

</style>
