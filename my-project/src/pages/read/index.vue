<template>
  <div class="novel-bookshelf">
    <div class="novel-bookshelf-main">
      <!--<pre style="text-align: left">
        {{txt}}
      </pre>-->
      <div class="booksList" v-for="(book,value,index) in booksList" @click="toBookDetail(book._id)" :key="index">
        <img :src="book.cover" alt="" class="page-lazyload-image">
        <div class="book-title">{{book.title}}</div>
        <div class="book-lastChapter">阅读至： {{book.lastReadChapter}}</div>
        <div class="book-newChapter">更新至： {{book.newChapter2}}</div>
      </div>
      <div class="booksList" id="bookSearch" @click="toSearch()">
        +
      </div>
    </div>
  </div>
</template>

<script>
  let query = 'query';
  export default {
    name: "index",
    data() {
      return {
        booksList: []
      }
    },
    computed: {},
    methods: {
      toBookDetail(id) {//去小说详情页面

      },
      toSearch() {
        let url='../search/main';
        wx.navigateTo({url});
      },
      getStorage() {
        let that = this;
        try {
          const res = wx.getStorageInfoSync();
          //如果不是第一次进入就加载以前存储的数据
          if (res.keys.indexOf('myBooks') > -1) {
            wx.getStorage({
              key: 'myBooks',
              success(res) {
                //类型string转object
                let data = JSON.parse(res.data);
                that.booksList = data.books;
                console.log(that.booksList)
              }
            })
          } else {
            //如果是第一次进入就创建数据
            let czyBooks = {
              "books": [{cover: '', title: '11', lastReadChapter: "22", newChapter2: '33'}, {
                cover: '',
                title: '1asf',
                lastReadChapter: "22",
                newChapter2: '33'
              }], "fontSize": 18
            };
            czyBooks = JSON.stringify(czyBooks);
            wx.setStorage({
              key: 'myBooks',
              data: czyBooks
            })
          }
        } catch (e) {
          //捕捉异常
          console.log(e)
          // Do something when catch error
        }
      },
      getBooks() {

      }
    },
    mounted() {
      this.getBooks();
      //this.booksList=books;
      //console.log(this.booksList)
    },
    created() {
      this.getStorage();
    }
  }
</script>

<style scoped>
  .novel-bookshelf {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #f8f8f8;
  }

  .novel-search {
    padding: 0px 10px;
  }

  .novel-bookshelf-main {
    height: calc(100% - 40px);
    margin-top: 40px;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  /*存储*/
  .booksList {
    height: 130px;
    width: calc(100% - 40px);
    padding: 15px 0px;
    border-bottom: 1px solid #9aec71;
    margin: auto;
    clear: both;
  }

  .booksList img {
    height: 100%;
    width: auto;
    float: left;
    max-width: 60px;
  }

  .page-lazyload-image[lazy=loading] {
    height: auto;
    width: 70px;
  }

  .book-title {
    height: 23px;
    width: calc(100% - 120px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #92465a;
  }

  .book-lastChapter {
    height: auto;
    width: calc(100% - 80px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #92465a;
    line-height: 1rem;
  }

  .book-newChapter {
    height: auto;
    width: calc(100% - 80px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #797700;
    line-height: 1rem;
    margin-top: 10px;
  }

  #bookSearch {
    line-height: 130px;
    text-align: center;
    font-size: 130px;
    color: black;
    opacity: 0.8;
  }
</style>
