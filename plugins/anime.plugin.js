const express = require("express");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get("/getanime", async (req, res) => {
let text = req.query.text
const getAnime = async(text) => {
try{
let enctext = encodeURIComponent(text)
let desuFind = await axios.get(`https://otakudesu.best/?s=${enctext}&post_type=anime`,{timeout:5000})

if(desuFind.status == 200){
const html = desuFind.data;
let hasil = [];
const $ = cheerio.load(html);
let logo = $('.logo > a > img').attr('src')
$('.chivsrc  > li').each(function (i,el){
const judul = $(el).find('h2').find('a').text()
const link = $(el).find('h2').find('a').attr('href')
let thumb = $(el).find('img').attr('src')
const item = {
  title : judul,
  link : link,
  thumb: thumb
}
  hasil.push(item)
});
if(hasil.length == 0) return {status: "error", author: "iwan", message: "Anime tidak ditemukan"}
return {status: "success", author: "iwan", result : {logo : logo, anime : hasil}}
}else{
return {status: "error", author: "iwan", message: "Error, Mungkin Api Rusak (code 1)"}
}
}catch(e){
return {status: "error", author: "iwan", message: "Error, Mungkin Api Rusak (code 2)"}
}
}
let resapi = await getAnime(text)
res.json(resapi)
});

module.exports = {
  name: "Anime Search",
  description: "Search Anime by Otakudesu",
  basePath: "",
  routes: [
    {
      method: "GET",
      path: "/getanime?text=",
      test: "Yuusha"
    }
  ],
  router
};
