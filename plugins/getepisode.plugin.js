const express = require("express");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get("/getepisode", async (req, res) => {
let url = req.query.url

const getEpisode = async (url) => {

if(!url) {
 return {status:"error", author:"iwan", message:"url parameter kosong"}
}

if(url.includes('https://otakudesu.best/anime/')){
try{

let fetchDesu = await axios.get(url,{
  timeout: 15000,
  maxRedirects: 5,
  headers:{
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept":
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language":"en-US,en;q=0.9",
    "Cache-Control":"no-cache",
    "Pragma":"no-cache",
    "Connection":"keep-alive",
    "Upgrade-Insecure-Requests":"1",
    "Referer":"https://otakudesu.best/"
  },
  validateStatus:()=>true
})

if(fetchDesu.status === 200){

let html = fetchDesu.data;
let $ = cheerio.load(html);

let maintitle = $('.jdlrx > h1').text().trim();
let thumbnail = $('.fotoanime > img').attr('src');

let listEpisode = [];

$('.episodelist > ul > li').each(function(i, elm){
  let link = $(elm).find('a').attr('href');
  let title = $(elm).find('a').text().trim();

  let getLink = { title, link }

  if(!title.includes('[BATCH]')){
    listEpisode.push(getLink)
  }
})

return {
  status: "success",
  author: "iwan",
  result : {
    title : maintitle,
    thumbnail : thumbnail,
    episode : listEpisode
  }
}

}else if(fetchDesu.status === 403){

return {
 status:"error",
 author:"iwan",
 message:"403 Forbidden dari server target (kemungkinan IP VPS diblok)"
}

}else{

return {
 status:"error",
 author:"iwan",
 message:"HTTP status: " + fetchDesu.status
}

}

}catch(e){
return {
 status:"error",
 author:"iwan",
 message:e.message
}
}

}else{
return {
 status:"error",
 author:"iwan",
 message:"Link tidak valid (harus domain otakudesu)"
}
}

}

let resapi = await getEpisode(url)
res.json(resapi)
});

module.exports = {
  name: "Get Episode",
  description: "Get Episode List",
  basePath: "",
  routes: [
    {
      method: "GET",
      path: "/getepisode?url=",
      test: "https://otakudesu.best/anime/mikata-yowasugite-hojo-mahou-sub-indo/"
    }
  ],
  router
};
