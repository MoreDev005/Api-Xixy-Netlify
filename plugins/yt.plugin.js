const express = require("express");
const router = express.Router();
const axios = require("axios");

async function yt(url,opsi) {
  try {
    const res = await axios.post("https://www.clipto.com/api/youtube",{url:url},
      {
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json",
          "origin": "https://www.clipto.com",
          "referer": "https://www.clipto.com/id/media-downloader/youtube-downloader",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
          "sec-ch-ua": `"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"`,
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": `"Windows"`,
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "priority": "u=1, i",
        },

        // kalau butuh kirim cookie
        withCredentials: true
      }
    );
	let mp3 = res.data?.medias.filter(a=>a.type==="audio" && a.audioQuality === "AUDIO_QUALITY_MEDIUM" && a.extension === "m4a")[0].url
    let mp4 = res.data?.medias.filter(a=>a.type==="video" && a.qualityLabel === '360p' && a.is_audio === true)[0].url
    const { medias,success, ...rest } = res.data;
      let result = {
          status: true,
          result: {
              ...rest,
              url: opsi == 'mp3' ? mp3 : mp4
          }
      };

    return result
  } catch (err) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
      return {status: false, author: "iwan", message: "Kesalahan Fetching Data"}
    } else {
      console.error("Error:", err.message);
      return {status: false, author: "iwan", message: "Kesalahan Api Panel"}
    }
  }
}
router.get("/yta", async (req, res) => {
let url = req.query.url
let resapi = await yt(url,"mp3")
res.json(resapi);
});

router.get("/ytv", async (req, res) => {
let url = req.query.url
let resapi = await yt(url,"mp4")
res.json(resapi);
});

module.exports = {
  name: "Youtube Downloader",
  description: "Download Video dan Audio Youtube",
  basePath: "",
  routes: [
    {
      method: "GET",
      path: "/yta?url=",
      test: "https://www.youtube.com/watch?v=uyyLot4PLXM"
    },
      {
      method: "GET",
      path: "/ytv?url=",
      test: "https://www.youtube.com/watch?v=uyyLot4PLXM"
    }
  ],
  router
};
