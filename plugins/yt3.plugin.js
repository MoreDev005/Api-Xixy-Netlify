const express = require("express");
const router = express.Router();
const axios = require('axios')

let json = null

const gB = Buffer.from('ZXRhY2xvdWQub3Jn', 'base64').toString()

const headers = {
  origin: 'https://v1.y2mate.nu',
  referer: 'https://v1.y2mate.nu/',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  accept: '*/*'
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function ts() {
  return Math.floor(Date.now() / 1000)
}

async function getjson() {
  if (json) return json
  const get = await axios.get('https://v1.y2mate.nu')
  const html = get.data
  const m = /var json = JSON\.parse\('([^']+)'\)/.exec(html)
  json = JSON.parse(m[1])
  return json
}

function authorization() {
  let e = ''
  for (let i = 0; i < json[0].length; i++) {
    e += String.fromCharCode(
      json[0][i] - json[2][json[2].length - (i + 1)]
    )
  }
  if (json[1]) e = e.split('').reverse().join('')
  return e.length > 32 ? e.slice(0, 32) : e
}

function extrakid(url) {
  const m =
    /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(url) ||
    /v=([a-zA-Z0-9_-]{11})/.exec(url) ||
    /\/shorts\/([a-zA-Z0-9_-]{11})/.exec(url) ||
    /\/live\/([a-zA-Z0-9_-]{11})/.exec(url)

  if (!m) throw new Error('invalid youtube url')
  return m[1]
}

async function init() {
  const key = String.fromCharCode(json[6])
  const url = `https://eta.${gB}/api/v1/init?${key}=${authorization()}&t=${ts()}`
  const res = await axios.get(url, { headers })
  if (res.data.error && res.data.error !== 0 && res.data.error !== '0') {
    throw res.data
  }
  return res.data
}

async function yt(videoUrl, format = 'mp3') {
  await getjson()

  const videoId = extrakid(videoUrl)

  const initRes = await init()

  let res = await axios.get(
    initRes.convertURL +
      '&v=' + videoId +
      '&f=' + format +
      '&t=' + ts() +
      '&_=' + Math.random(),
    { headers }
  )

  let data = res.data

  if (data.error && data.error !== 0) {
      return {
        status:false,
        message: "Gagal saat initialisasi"
    }
    //throw data
  }

  if (data.redirect === 1 && data.redirectURL) {
    const r2 = await axios.get(
      data.redirectURL + '&t=' + ts(),
      { headers }
    )
    data = r2.data
  }

  if (data.downloadURL && !data.progressURL) {
    return {
     status:true,
     author:"iwan",
     result:{
      id: videoId,
      title: data.title,
      format,
      url: data.downloadURL
     }
    }
  }

  for (;;) {
    await sleep(3000)

    const progressRes = await axios.get(
      data.progressURL + '&t=' + ts(),
      { headers }
    )

    const p = progressRes.data

    if (p.error && p.error !== 0) {  return {
        status:false,
        message: "Retry progress gagal"
    }
      //throw p
    }

    if (p.progress === 3) {
      return {
       status: true,
       author: "iwan",
       result:{
        id: videoId,
        title: p.title,
        format,
        url: data.downloadURL
       }
      }
    }
  }
}

router.get("/yta3", async (req, res) => {
let url = req.query.url
let resapi = await yt(url,"mp3")
res.json(resapi);
});

router.get("/ytv3", async (req, res) => {
let url = req.query.url
let resapi = await yt(url,"mp4")
res.json(resapi);
});

module.exports = {
  name: "Youtube Downloader V3",
  description: "Download Video dan Audio Youtube Unblock",
  basePath: "",
  routes: [
    {
      method: "GET",
      path: "/yta3?url=",
      test: "https://www.youtube.com/watch?v=uyyLot4PLXM"
    },
      {
      method: "GET",
      path: "/ytv3?url=",
      test: "https://www.youtube.com/watch?v=uyyLot4PLXM"
    }
  ],
  router
};
