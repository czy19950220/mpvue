<template>
  <div class="novel-bookshelf">
    <div class="novel-bookshelf-main">
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
        booksList: [],
        myBooks: [],
      }
    },
    computed: {},
    methods: {
      toBookDetail(id) {//去小说详情页面

      },
      toSearch() {
        let url = '../search/main';
        wx.switchTab({url});
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
                //console.log(that.booksList)
              }
            })
          } else {
            //如果是第一次进入就创建数据
            let czyBooks = {
              "books": [], "fontSize": 18
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
        let that = this;

        function step1() {
          return new Promise(function (resolve, reject) {
            wx.getStorage({
              key: 'myBooks',
              success(res) {
                //类型string转object
                let myBooks = JSON.parse(res.data);
                that.myBooks = myBooks;
                console.log(that.myBooks)
                resolve();
              }
            });
          })
        };

        function step2() {
          return new Promise(function (resolve, reject) {
            console.log(that.myBooks)
            let books = that.myBooks.books;
            let loading = 0;
            for (let i = 0; i < that.myBooks.books.length; i++) {
              let search = `http://api.zhuishushenqi.com/book/${that.myBooks.books[i]._id}`;
              wx.request({
                url: search,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  loading++;
                  books[i].newChapter2 = res.data.lastChapter;
                  books[i].lastReadChapter = books[i].lastReadChapter||'还没阅读';
                  if (loading == that.myBooks.books.length) {
                    that.booksList = books;
                  }
                }
              });
            }
            resolve();
          });
          //console.log(books)
        }
        step1().then(step2);
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
    background-color: #f8f8f8;
  }

  .novel-bookshelf-main {
    height: 100%;
    width: 100%;
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
    width: 80px;
    float: left;
  }

  .book-title {
    height: 23px;
    width: calc(100% - 120px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #216412;
  }

  .book-lastChapter {
    height: auto;
    width: calc(100% - 120px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #216412;
    line-height: 1rem;
  }

  .book-newChapter {
    height: auto;
    width: calc(100% - 120px);
    font-size: 14px;
    float: left;
    text-align: left;
    padding-left: 20px;
    color: #797700;
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
