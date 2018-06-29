import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
// 设置默认请求头
// axios.defaults.headers = {
//   'X-Requested-With': 'XMLHttpRequest'
// };

const cookie = {
  withCredentials: true
}

const get = (url, param, bool = false) => {
  let config = {
    method: "get",
    url: url,
    params: param
  }
  if (!!bool) config['withCredentials'] = true
  return new Promise((resolve, reject) => {
    axios(config).then(Response => {
      resolve(Response)
    }).catch(error => {
      reject(error)
    })
  })
}

const post = (url, data, bool = false) => {
  let config = {
    method: "post",
    url: url,
    params: data
  }
  if (!!bool) config['withCredentials'] = true
  return new Promise((resolve, reject) => {
    axios(config).then(Response => {
      resolve(Response)
    }).catch(error => {
      reject(error)
    })
  })
}

// axios.all([
//   axios.get('/banner'),
//   axios.get('/personalized', { params: { limit: 2 } }),
// ]).then(axios.spread((res1, res2, res3, res4, res5, res6) => {
// }))
export const all = (arr=[]) => {
  return new Promise((resolve, reject) => {
    axios.all(arr).then().catch(error => {
      reject(error)
    })
  })
}

//登录
export const login = param => {
  return get('/login/cellphone', param, true)
}
//轮播图
export const banner = param => {
  return get('/banner', param)
}

export const songs = param => {
  return get('/recommend/songs', param, true)
}

export const personalized = param => {
  return get('/personalized', param)
}

export const newsong = param => {
  return get('/personalized/newsong', param)
}

export const privatecontent = param => {
  return get('/personalized/privatecontent', param)
}

export const resource = param => {
  return get('/recommend/resource', param, true)
}

export const recommend = param => {
  return get('/dj/recommend', param)
}

//歌曲评论 param=>id, ..limit：评论数，offset：页数
export const music = param => {
  return get('/comment/music', param)
}
//喜欢音乐 param=>id, ..like
export const like = param => {
  return get('/like', param)
}
