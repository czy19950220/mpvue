<template>
  <!--小说搜索-->
  <div class="book-search">
    <mp-toast type="error" v-model="showToast" content="没找到"></mp-toast>
    <div class="book-search-main">
      <header>
        <div class="weui-cells weui-cells_after-title search-button">
          <mp-input :placeholder="query==''?'请输入搜索内容':''" v-model="query"></mp-input>
        </div>
        <mp-button type="default" size="large" @click="getSearch()" btnClass="mb15">搜索</mp-button>
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

  export default {
    components: {
      mpInput,
      mpButton,
      mpToast,
      mpBadge
    },
    name: "search",
    data() {
      return {
        query: '',
        searchResult: [],
        showToast: false
      }
    },
    computed: {},
    methods: {
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
                item.shortIntro = item.shortIntro.length > 30 ? item.shortIntro.substr(0, 30) + "....." : item.shortIntro;
              });
              //console.log(bookList)
              that.searchResult = bookList;
            }
          }
        })
      },
      toBook(result) {

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

  .mui-icon {
    font-size: 16px;
    color: #fb3535;
  }

  .mint-badge.is-primary {
    color: darkcyan;
    height: 20px;
    line-height: 16px;
    background-color: #efeff4;
    border: 1px solid #666;
    float: right;
  }

  .book-result-img {
    height: 100%;
    width: 68px;
    float: left;
  }

  .placeholder-class-test {
    padding-left: 10px;
  }

  .page__bd_spacing {
    padding: 0 0 30px;
  }

  .weui-cells {
    padding: 0 20px;
  }

  .autoBtnClass {
    margin: 15px;
  }

  .search-button {
    margin-bottom: 10px;
  }
</style>
