<template>
  <!--小说搜索-->
  <div class="book-search">
    <mp-modal ref="mpModal" :title="title" :content="content" :showCancel="true" confirmText="添加书架" @confirm="confirm" @cancel="cancel"></mp-modal>
    <mp-toast type="error" v-model="showToast" content="没找到"></mp-toast>
    <mp-toast type="success" v-model="showToast2" content="添加成功"></mp-toast>
    <mp-toast type="warn" v-model="showToast3" content="已有当前书"></mp-toast>
    <div class="book-search-main">
      <header>
        <div class="weui-cells weui-cells_after-title search-button">
          <mp-input :placeholder="query==''?'请输入搜索内容':''" v-model="query"></mp-input>
        </div>
        <div class="buttons">
          <div class="my-button"><mp-button type="default" size="large" btnClass="mb15" @click="toShelf()">书架</mp-button></div>
          <div class="my-button"><mp-button type="primary" size="large" @click="getSearch()" btnClass="mb15">搜索</mp-button></div>
          <div class="my-button"><mp-button type="primary" size="large" @click="toIndex()" btnClass="mb15">首页</mp-button></div>
        </div>
      </header>
      <div class="search-book-result">
        <div class="result-detail" v-for="(result,value,index) in searchResult" @click="toBook(result)" :key="index">
          <img :src="result.cover" :alt="result.title" class="book-result-img">
          <div class="book-title">{{result.title}}</div>
          <div class="book-shortIntro">{{result.shortIntro}}</div>
          <div class="author-and-cat">
            <span>{{result.author}}|&nbsp;</span>
            <span>{{result.cat}}&nbsp;|&nbsp;</span>
            <mp-badge :dot=false :info='result.latelyFollower' badgePos="right">
            </mp-badge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mpInput from 'mpvue-weui/src/input';
  import mpButton from 'mpvue-weui/src/button';
  import mpToast from 'mpvue-weui/src/toast';
  import mpBadge from 'mpvue-weui/src/badge';
  import mpModal from 'mpvue-weui/src/modal';

  export default {
    components: {
      mpInput,
      mpButton,
      mpToast,
      mpBadge,
      mpModal
    },
    name: "search",
    data() {
      return {
        query: '',//查询数据
        searchResult: [],//搜索结果
        showToast: false,//搜索回调提示
        title:'小说名',//弹出层标题
        content:'小说内容',//弹出层内容
        showToast2:false,//添加书架提示
        showToast3:false,//添加书架提示2
        currentBook:'',//当前点击的书
      }
    },
    computed: {},
    methods: {
      //首页
      toIndex(){
        let url = '../index/main';
        wx.navigateTo({url});
      },
      //转化封面url为实际url
      url2Real(url) {
        if (url.search(/agent/i) === -1) {
          return 'http://api.zhuishushenqi.com' + url;
        }
        else {
          return decodeURIComponent(url.replace(/\/agent\//, ''));
        }
      },
      //搜索书籍
      getSearch() {
        let that = this;
        let url = `http://api.zhuishushenqi.com/book/fuzzy-search?query=${this.query}&start=0&limit=20`;
        wx.request({
          url: url,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            //console.log(res.data);
            let bookList = res.data.books;
            if (bookList.length == 0) {
              that.showToast = true;
            } else {
              bookList.map((item) => {
                //图片比例140:200
                item.cover = item.cover ? that.url2Real(item.cover) : '../assets/imgs/err.png';
                item.shortIntro2 = item.shortIntro;
                item.shortIntro = item.shortIntro.length > 30 ? item.shortIntro.substr(0, 30) + "....." : item.shortIntro;
              });
              that.searchResult = bookList;
            }
          }
        })
      },
      //打开书籍详情
      toBook(result) {
        let that=this;
        function step1() {
          return new Promise(function (resolve, reject) {
            that.currentBook=result;
            that.title=result.title;
            that.content=result.shortIntro2;
            resolve();
          })
        };
        function step2() {
          return new Promise(function (resolve, reject) {
            //console.log(that.title)
            //console.log(that.content)
            that.$refs.mpModal.show().then();
            resolve();
          })
        };
        step1().then(step2);
      },
      //点击确定时回调
      confirm(){
        let that=this,czyBooks;
        try {
          wx.getStorage({
            key: 'myBooks',
            success(res) {
              //类型string转object
              let data = JSON.parse(res.data);
              let num=0,len=data.books.length;
              //看看本地存储是否有当前书
              for (let i=0;i<len;i++){
                if (data.books[i]._id==that.currentBook._id) {
                  num++;
                }
              }
              if (num==0){//书架没有当前书就添加
                data.books.push(that.currentBook);
                wx.setStorage({
                  key: 'myBooks',
                  data: JSON.stringify(data)
                })
                that.showToast2=true;
              } else {//书架有当前书就不再添加了
                that.showToast3=true;
              }
            }
          })
        } catch (e) {
          console.log(e)
        }
      },
      //点击取消时回调
      cancel(){

      },
      //去书架
      toShelf(){
        let url = '../read/main';
        wx.reLaunch({url});
      }
    },
    mounted() {
      //this.getSearch();
      //console.log(this.bookDetail)
    },
    created() {

    }
  }
</script>

<style scoped>
  .book-search {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .book-search-main {
    height: calc(100% - 10px);
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 10px;
  }

  .search-book-result {
    clear: both;
  }

  .result-detail {
    width: calc(100% - 20px);
    margin: auto;
    height: 100px;
    padding: 5px 10px;
    border-bottom: 1px solid burlywood;
  }

  .book-title {
    width: calc(100% - 100px);
    float: left;
    text-align: left;
    padding-left: 10px;
    font-size: 14px;
    color: #ec2828;
  }

  .book-shortIntro {
    width: calc(100% - 80px);
    float: left;
    padding-left: 10px;
    text-align: left;
    font-size: 14px;
    color: #666;
    height: 42px;
    overflow: hidden;
  }

  .author-and-cat {
    width: calc(100% - 80px);
    float: left;
    padding-left: 10px;
    text-align: left;
    font-size: 14px;
    overflow: hidden;
    padding-top: 4px;
    color: #666;
  }

  .book-result-img {
    height: 100%;
    width: 68px;
    float: left;
  }

  .weui-cells {
    padding: 0 20px;
  }

  .search-button {
    margin-bottom: 10px;
  }

  .buttons{
    width: 90%;
    margin-left: 5%;
  }
  .buttons .my-button{
    width: calc(50% - 20px);
    float: left;
    text-align: center;
    padding: 0px 10px;
  }
</style>
