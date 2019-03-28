<template>
  <div>
    <div style="margin-top: 15px;">
      <el-input @keyup.enter.native="searchSong" clearable placeholder="请输入内容" v-model="searchText"
                class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchSong"></el-button>
      </el-input>
    </div>
    <aplayer autoplay
             :repeat="repeat"
             :lrc="lrc"
             :controls="true"
             :showLrc="true"
             :music="music"
             :list="lists"
    />
  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import axios from 'axios'
  import Aplayer from 'vue-aplayer'

  export default {
    components: {
      Aplayer
    },
    name: 'Music',
    data() {
      return {
        repeat:'repeat-all',
        lrc:'',
        select: 'qq',
        searchText: '',
        searchResult: {},
        lists: [],
        music: {
          artist: "张晓棠 ",
          id: 25640582,
          pic: "http://p1.music.126.net/WnuS2v6i9qKWCHKTxpw4uA==/19025949207225417.jpg",
          src: "http://m10.music.126.net/20190319153523/b5c524aad115b1fbd9d670545f7d9878/ymusic/f32f/b99e/f79a/d5515424706bffeb3bbcccfca5ba40c8.mp3",
          title: "苏幕遮"
        }
      }
    },
    methods: {
      searchSong() {
        NProgress.start();
        NProgress.set(0.3);
        let param = {keyWord: this.searchText, offSet: 0};
        let url = 'http://127.0.0.1:7001/music/findMusic';
        axios.get(url, {params: param})
          .then((response) => {
            NProgress.set(0.5);
            this.lists = response.data.data;
            for (let i = 0; i < this.lists.length; i++) {
              this.lists[i].src=this.lists[i].src.data.url;
            }
            NProgress.set(0.9);
            /*this.lists.forEach((value,index,array)=>{
              //console.log(value,index,array)
              array[index].src=value.src.data.url;
            })*/
          }).then(()=>{
          this.music=this.lists[0];
          console.log(this.music);
          NProgress.done()
        }).catch((err) => {
          console.log(err);
        });
      },
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
