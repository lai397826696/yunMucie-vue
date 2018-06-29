import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import * as ajax from './util/severAPI';
import {objCopy} from './util/util';
Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:3000';

const local = (arr = '') => {
  let star = window
    .localStorage
    .getItem("userinfo");
  if (!!arr && star != "undefined") 
    return JSON.parse(star)[arr];
  return !!star
    ? true
    : false;
}

const state = {
  banners: [],
  newMusic: [], //最新音乐
  resource: [], //每日推荐
  sole: [], //独家放送
  dj: [], //dj
  songs: [], //推荐音乐
  audioPlaying: { //播放的歌曲及状态
    id: '',
    album: {},
    alias: [],
    artists: [],
    playing: false
  },
  barList: 0,
  song_catalogue: [], //播放目录
  playmode: { //播放模式
    key: 0,
    class: 'icon-liebiaoxunhuan',
    name: '列表循环'
  },
  playmodeIndex: 0
}

const mutations = {
  indexfn(state, {banners, resource, newMusic, sole, dj}) {
    state.banners = banners;
    newMusic.length = 6;
    state.newMusic = newMusic;
    state.resource = resource;
    state.sole = sole;
    state.dj = dj;
  },
  set_recommend(state, {songs}) {
    state.songs = songs
    state.song_catalogue = songs;
  },
  set_changePlaylist(state, { key }) {
    //播放全部
    state.song_catalogue = objCopy(state[key]);
    state.audioPlaying.id = state.song_catalogue[0].id
  },
  set_playing(state, {data, type}) { //点击歌曲播放
    if (type !== "popup") {
      //如果播放目录有删减，把当前歌单配置给播放目录
      if (state.song_catalogue.length != state.songs.length) 
        state.song_catalogue = objCopy(state.songs);
    }
    state.audioPlaying = data
    state.audioPlaying.playing = true
  },
  set_audioStatus(state, {playing}) {
    state.audioPlaying.playing = playing;
  },
  remove_songCatalogue(state, {index, id}) {
    let length = state.song_catalogue.length;
    if (length == 1) state.audioPlaying.id = ''
    for (let i = 0; i < length; i++) {
      if (state.song_catalogue[i].id == id && state.audioPlaying.id == id) {
        if (i == length - 1) {
          state.audioPlaying = state.song_catalogue[0]
        } else {
          state.audioPlaying = state.song_catalogue[i + 1]
        }
        break;
      }
    }
    state.song_catalogue.splice(index, 1);
  },

  set_playmode(state) { //设置播放模式
    let type = [
      {
        key: 0,
        name: '列表循环',
        class: 'icon-liebiaoxunhuan'
      }, {
        key: 1,
        name: '随机播放',
        class: 'icon-suijibofang'
      }, {
        key: 2,
        name: '单曲循环',
        class: 'icon-danquxunhuan'
      }
    ]
    if (state.playmodeIndex == 2) 
      state.playmodeIndex = -1
    state.playmodeIndex++;
    state.playmode = type[state.playmodeIndex]
  },
  empty_songCatalogue(state) {
    state.song_catalogue = [];
  }
}

const actions = {
  indexapi({commit}) {
    axios.all([
      axios.get('/banner'),
      axios.get('/personalized', {
        params: {
          limit: 2
        }
      }),
      axios.get('/recommend/resource', {withCredentials: true}),
      axios.get('/personalized/newsong'),
      axios.get('/personalized/privatecontent'),
      axios.get('/dj/recommend', {withCredentials: true})
    ]).then(axios.spread((res1, res2, res3, res4, res5, res6) => {
      commit('indexfn', {
        banners: res1.data.banners,
        resource: [].concat(res2.data.result, res3.data.recommend),
        newMusic: res4.data.result,
        sole: res5
          .data
          .result
          .reverse(),
        dj: res6.data.djRadios
      })
    }))
  },
  recommendapi({commit}) {
    ajax.songs().then(res => {
      commit('set_recommend', {songs: res.data.recommend})
    })
  }
}

const getters = {
  // playdatasing(state) { //正在播放的歌曲
  //   if (!!state.audiodata.id && state.song_catalogue.length > 0) {
  //     return state
  //       .song_catalogue
  //       .find(v => v.id == state.audiodata.id);
  //   }
  //   return state.playdataing;
  // },
  playidURL(state, getters) {
    return !!state.audioPlaying.id
      ? `http://music.163.com/song/media/outer/url?id=${state.audioPlaying.id}.mp3`
      : '';
  }
}

export default new Vuex.Store({state, mutations, actions, getters, strict: true})