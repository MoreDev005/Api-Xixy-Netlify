const express = require("express");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get("/getepisode", async (req, res) => {
let url = req.query.url
const getEpisode = async (url) => {
if(url.includes('https://otakudesu.best/anime/')){
try{
let fetchDesu = await axios.get(url,{timeout:5000});

if(fetchDesu.status === 200) {
let html = fetchDesu.data;
let $ = cheerio.load(html);
let maintitle = $('.jdlrx > h1').text();
let thumbnail = $('.fotoanime > img').attr('src');
let listEpisode = [];
$('.episodelist > ul > li').each(function(i, elm){
  let link = $(elm).find('a').attr('href');
  let title = $(elm).find('a').text();
  let getLink = {
    title: title,
    link: link
  }
  if(getLink.title.includes('[BATCH]')){
  }else{listEpisode.push(getLink)};
})
return {status: "success", author: "iwan", result : {title : maintitle, thumbnail : thumbnail, episode : listEpisode}}
}else{
return {status: "error", author: "iwan", message: "Error, Mungkin Api Rusak (code 1)"}
}
}catch(e){
return {status: "error", author: "iwan", message: e.message}
}
}else{
  return {status: "error", author: "iwan", message: "Error, Link tidak Valid (code 3)"}
  }
}
let resapi = await getEpisode(url)
res.json(resapi)
});

module.exports = {
  name: "Get Episode",
  description: "Get Epidose List",
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
