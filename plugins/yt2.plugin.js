const express = require("express");
const router = express.Router();
const axios = require("axios");

async function yt(url,opsi) {
  try {
    const headers = {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Origin": "https://downloaderto.com",
      "Referer": "https://downloaderto.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest",
    };

    if (!url) {
      return {
        status: false,
        message: "URL tidak boleh kosong",
      };
    }

    const payload = new URLSearchParams({
      copyright: 0,
      format: opsi === "mp3" ? "m4a" : "360",
      url,
      api: "dfcb6d76f2f6a9894gjkege8a4ab232222",
    }).toString();

    // 🔹 Request awal
    const init = await axios.get(
      `https://p.savenow.to/ajax/download.php?${payload}`,
      { headers, timeout: 15000 }
    );

    if (!init.data || !init.data.progress_url) {
      return {
        status: false,
        message: "Gagal mendapatkan progress URL",
      };
    }

    const { progress_url, info } = init.data;

    // 🔹 Polling status
    async function waitUntilSuccess(
      url,
      { interval = 5000, maxRetry = 10 } = {}
    ) {
      for (let i = 1; i <= maxRetry; i++) {
        try {
          const res = await axios.get(url, {
            headers,
            timeout: 10000,
          });

          if (res.data?.success === 1) {
            return res.data;
          }

          await new Promise((r) => setTimeout(r, interval));
        } catch (err) {
          // lanjut retry
          await new Promise((r) => setTimeout(r, interval));
        }
      }
      return null;
    }

    const final = await waitUntilSuccess(progress_url);

    if (!final) {
      return {
        status: false,
        message: "Timeout: server tidak merespon hasil download",
      };
    }

    if (!final.download_url) {
      return {
        status: false,
        message: "Download URL tidak ditemukan",
      };
    }

    // ✅ Sukses
    return {
      status: true,
      author: "iwan",
      result: {
        title: info?.title || "Unknown",
        thumbnail: info?.image || null,
        url: final.download_url,
        alternative: final.alternative_download_urls || [],
      },
    };

  } catch (err) {
    // 🔥 Error global (axios / runtime)
    return {
      status: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan tidak diketahui",
    };
  }
}

router.get("/yta2", async (req, res) => {
let url = req.query.url
let resapi = await yt(url,"mp3")
res.json(resapi);
});

router.get("/ytv2", async (req, res) => {
let url = req.query.url
let resapi = await yt(url,"mp4")
res.json(resapi);
});

module.exports = {
  name: "Youtube Downloader V2",
  description: "Download Video dan Audio Youtube Unblock",
  basePath: "",
  routes: [
    {
      method: "GET",
      path: "/yta2?url=",
      test: "https://www.youtube.com/watch?v=uyyLot4PLXM"
    },
      {
      method: "GET",
      path: "/ytv2?url=",
      test: "https://www.youtube.com/watch?v=uyyLot4PLXM"
    }
  ],
  router
};
