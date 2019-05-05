<template>
  <!--书架-->
  <div class="novel-bookshelf">
    <mp-modal ref="mpModal"
              title="删除"
              :content="content"
              :showCancel="true"
              @confirm="confirm"
              @cancel="cancel">
    </mp-modal>
    <div class="novel-bookshelf-main">
      <div class="booksList" @longtap="longTap(book.title)" v-for="(book,value,index) in booksList"
           @tap="toBook(book._id,book.lastReadChapterIndex)" :key="index">
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
  import mpModal from 'mpvue-weui/src/modal';

  export default {
    components: {
      mpModal,
    },
    name: "index",
    data() {
      return {
        booksList: [],//当前获取的列表
        myBooks: [],//本地存储的列表
        lockTap: false,//长按和短按的判定
        content: "",//删除显示内容=title
      }
    },
    computed: {},
    methods: {
      //点击取消时回调
      cancel() {
        wx.showToast({
          title: '已取消',
          icon: 'success',
          duration: 500,
          mask: true
        });
      },
      //点击确定时回调
      confirm() {
        let len = this.booksList.length, that = this, index = 0;
        //获取当前删除选项索引
        for (let i = 0; i < len; i++) {
          if (that.booksList[i].title == this.content) {
            index = i;
          }
        }
        //删除当前选项
        this.booksList.splice(index, 1);
        this.myBooks.books = this.booksList;
        //存储
        wx.setStorage({
          key: 'myBooks',
          data: JSON.stringify(that.myBooks)
        });
        //提示
        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 500,
          mask: true
        });
      },
      //去阅读
      toBook(id, page) {//去小说阅读页面,通过路由传递参数id
        if (!this.lockTap) {
          let url;
          if (page == undefined) {
            url = `../book/main?id=${id}&page=0`;
          } else {
            url = `../book/main?id=${id}&page=${page}`;
          }
          wx.reLaunch({url});
        } else {
          this.lockTap = false;
        }

      },
      //去搜索
      toSearch() {//去搜索书籍
        let url = '../search/main';
        wx.reLaunch({url});
      },
      //获取本地存储
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
      //获取书详情
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
                //console.log(that.myBooks)
                resolve();
              }
            });
          })
        };

        function step2() {
          return new Promise(function (resolve, reject) {
            //console.log(that.myBooks)
            let books = that.myBooks.books;
            let loading = 0;
            for (let i = 0; i < that.myBooks.books.length; i++) {
              let search = `http://api.zhuishushenqi.com/book/${that.myBooks.books[i]._id}`;
              let search2 = `${that.$JsonBird}http://api.zhuishushenqi.com/book/${that.myBooks.books[i]._id}`;
              wx.request({
                url: search2,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  loading++;
                  books[i].newChapter2 = res.data.lastChapter;
                  books[i].lastReadChapter = books[i].lastReadChapter || '还没阅读';
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
      },
      //长按删除
      longTap(title) {
        this.lockTap = true;//长按上锁
        let that = this;

        function F1() {
          return new Promise((resolve, reject) => {
            that.content = title;
            resolve();
          })
        }

        function F2() {
          that.$refs.mpModal.show();//打开删除弹框
        }

        F1().then(F2)
      }
    },
    mounted() {
      this.getBooks();
      wx.onNetworkStatusChange(function (res) {
        console.log(res.isConnected);
        console.log(res.networkType)
      })
      wx.getNetworkType({
        success(res) {
          const networkType = res.networkType
          console.log(networkType)
        }
      })
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
  }

  .novel-bookshelf-main {
    background-color: #f8f8f8;
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
    line-height: 1.5;
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
