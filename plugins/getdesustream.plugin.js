const express = require("express");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get("/getdesustream", async (req, res) => {
let url = req.query.url
const getDesustream = async (url) => {
try{
let fetchDesu = await axios.get(url);

if(fetchDesu.status === 200) {
let $ = cheerio.load(fetchDesu.data)
let desulink =[];
let logo = $('.logo > a > img').attr('src')
let judul = $('.posttl').text();
$('.responsive-embed-stream').each(async(i,elm)=>{
   let link = $(elm).find('iframe').attr('src')
   desulink.push(link)
 })

if(desulink.length>0){
return {status:'success',author:'iwan',result:{logo : logo, title : judul, linkStream:desulink[0]}}
 }
}else{
return {status:'error',author:'iwan',message:'Kesalahan pada Library Api'}
}
}catch(e){
return {status:'error',author:'iwan',message:e.message}
}
}
let resapi = await getDesustream(url)
res.json(resapi)
});

module.exports = {
  name: "Get Stream Episode",
  description: "Get Stream Epidose",
  basePath: "",
  routes: [
    {
      method: "GET",
      path: "/getdesustream?url=",
      test: "https://otakudesu.best/episode/myhm-episode-1-sub-indo//"
    }
  ],
  router
};
