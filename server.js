const express = require('express')
const path = require('path')
const CONFIG = require('./config.js')
const fs = require('fs-extra')
const _ = require('lodash')

// upg: provide config (if secure)
//
// upg: pull solar noon localy and provide delta adjust?  though that's calcable?  give slack.. or better yet.. use permissions to show clock?

;(async n=>{
	// server
	//
	let {port,data_path} = CONFIG

	let l = await fs.readdir(data_path)
	l = _.sortBy(l)

	let imageList = l


	let waits = []
	let app = express()

	console.log(process.env)

	let {MASTER_KEY} = process.env

	let i = 0

	let _flush = false
	const flush = n=>{
		if(!_flush){
			_flush = true
			waits = waits.filter(v=>{
				let {id,req,res} = v
				if(id != i)
					res.json(i)
				else
					return true
				})	
			_flush = false
			}
		}

	// upg: how to get from settings
	app.get('/config',async (req,res)=>{
		
		res.json({})

		})

	app.all('/since/:i?',async (req,res)=>{
		let {params} = req
		let ii = parseInt(params.i)
		if(i != ii) 
			res.json(i)
		else {
			waits.push({req,res,id:i})
			flush()
			}
		})


	app.all('/home',async (req,res)=>{
		i = 0
		flush()
		res.json({id:i})
		})

	app.all('/end',async (req,res)=>{
		i = imageList.length-1
		flush()
		res.json({id:i})
		})
	
	app.all('/range',async (req,res)=>{
		res.json({min:0,max:imageList.length-1})
		})

	app.all('/update/:delta?',async (req,res)=>{
		let {params} = req
		let {delta} = params
		delta = parseInt(delta)
		i += delta
		let max = imageList.length-1
		if(i<0) i = 0
		else
		if(i>max)
			i = max
		flush()
		res.json({id:i})
		})

	app.all('/media/:id',async (req,res)=>{	
		let {params} = req
		let {id} = params
		let max = imageList.length-1
		if(id > max) id = max
		else
		if(id < 0) id = 0

		let f = path.join(data_path,imageList[id])
		
		
		res.sendFile(f)
		})

	app.use(express.static(path.join(__dirname,'www')))
	//app.use('/media',express.static(data_path))

	app.listen(port,async n=>{
		console.log('port ready',port)
		})
	})();
