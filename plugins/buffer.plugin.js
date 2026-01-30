const express = require("express");
const router = express.Router();
const axios = require('axios');
const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
                'range': 'bytes=0-',
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

router.get('/buffer', async (req,res) => {
const q = req.query.url
const emulate = () =>{
const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
                'range': 'bytes=0-',
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}
async function start() {
try{
const respon = await getBuffer(q)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

module.exports = {
  name: "Unblock Download",
  description: "Bypass Link Unduhan",
  basePath: "",
  routes: [
    {
      method: "GET",
      path: "/buffer?url=",
      test: "https://uploader.xixy.my.id/background.jpg"
    }
  ],
  router
};
