<template>
  <!--章节目录-->
  <div class="chapters">
    <div class="slider">
      <mp-slider
        :value="chapterIndex"
        showValue
        blockSize=20
        :max="maxNum"
        min="1"
        @change="change"
        @changing="changing"
      >
      </mp-slider>
    </div>
      <div class="chapter" v-for="(chapter,index) in chapterList" @click="toRead(index)" :key="index">
        {{chapter.title}}
      </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import mpSlider from 'mpvue-weui/src/slider';

  export default {
    components: {
      mpSlider
    },
    name: "index",
    data() {
      return {
        chapterList: [],//目录
        bookId: '',//书的ID
        maxNum: 1000,//章节最大值
        chapterIndex: 10,//当前值
        page: 0,
        toView: 'index1',//锚点
      }
    },
    computed: {
      ...mapGetters([
        'sourceId'
      ])
    },
    watch:{

    },
    methods: {
      //获取连接
      getLink(id) {
        return new Promise((resolve, reject) => {
          let url = `http://api.zhuishushenqi.com/toc/${id}?view=chapters`;
          let url2 = `${this.$JsonBird}http://api.zhuishushenqi.com/toc/${id}?view=chapters`;
          let that = this;
          wx.request({
            url: url2,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.status == 200 || res.statusCode == 200) {
                that.chapterList = res.data.chapters;//章节列表
                that.maxNum = res.data.chapters.length;
                resolve();
              }
            }
          })
        })
      },
      //返回读书
      toRead(index) {
        let url = `../book/main?id=${this.bookId}&page=${index}`;
        wx.redirectTo({url});
      },
      change(e) {
        const query = wx.createSelectorQuery();
        query.select('.chapter').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function (res) {
          //console.log(res[0].height * parseInt(e.mp.detail.value), res[0].height)
          wx.pageScrollTo({
            scrollTop: res[0].height * parseInt(e.mp.detail.value) - 40,
            duration: 30
          })
        });
      },
      change2(page) {
        let that=this;
        if (this.chapterList == []) {//如果没有数据就重新获取
          setTimeout(() => {
            this.change2(page)
          }, 100)
        } else {//如果有数据就定位到阅读的章节目录位置
            const query = wx.createSelectorQuery();
            query.select('.chapter').boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec(function (res) {
              if(res[0]){//如果dom循环有渲染完成就执行定位
                wx.pageScrollTo({
                  scrollTop: res[0].height * page - 50,
                  duration: 30
                });
              }else {//如果dom循环还没有渲染完成就重新执行
                console.log(11);
                that.change2(page)
              }
            });
        }
      },
      changing(e) {//在拖动的时候改变位置
        const query = wx.createSelectorQuery();
        query.select('.chapter').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function (res) {
          wx.pageScrollTo({
            scrollTop: parseInt(e.mp.detail.value) * res[0].height - 40,
            duration: 0
          })
        });
      }
    },
    create() {

    },
    onLoad: function (options) {
      this.chapterIndex = parseInt(options.page) + 1;
      this.bookId = options.id;
      this.getLink(this.sourceId).then(this.change2(options.page));
    }
  }
</script>

<style scoped>
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }

  .chapters {
    height: 100%;
    width: 100%;
    padding-top: 40px;
  }

  .chapter {
    height: 42px;
    width: 100%;
    padding: 0 10px;
    text-align: left;
    border-top: 1px solid #454121;
    line-height: 42px;
    font-size: 18px;
    background-color: whitesmoke;
    overflow: hidden;
  }

  .slider {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 40px;
    z-index: 10;
    background-color: #affff1;
  }
</style>
