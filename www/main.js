;(async n=>{
	document.body.ondblclick = n=>{
		//toggle fullscreen // upg: use polyfill
		if(document.fullscreen)
			document.exitFullscreen()
		else
			document.documentElement.requestFullscreen() 
		}//func


	document.body.onclick = n=>{
		fetch('/update/1')
		}


	document.addEventListener('keydown', e=>{
		let {key} = e
		console.log(key)
		if(key == 'h')
			fetch('/home')
		else
		if(key == 'e')
			fetch('/end')
		else
		if(key == 'ArrowLeft')
			fetch('/update/-1')
		else
		if(key == 'ArrowRight')
			fetch('/update/1')
		})
	


	if ('wakeLock' in navigator) {
		console.log('wakeable!')


		// The wake lock sentinel.
		let wakeLock = null;

		// Function that attempts to request a screen wake lock.
		const requestWakeLock = async () => {
		  try {
		    wakeLock = await navigator.wakeLock.request('screen');
		    wakeLock.addEventListener('release', () => {
		      console.log('Screen Wake Lock was released');
		    });
		    console.log('Screen Wake Lock is active');
		  } catch (err) {
		    console.error(`${err.name}, ${err.message}`);
		  }
		};

		// Request a screen wake lock…
		await requestWakeLock();
		// …and release it again after 5s.
		//window.setTimeout(() => {
		//  wakeLock.release();
		//  wakeLock = null;
		//}, 5000);
	
		const handleVisibilityChange = () => {
		  if (wakeLock !== null && document.visibilityState === 'visible') {
		    requestWakeLock();
		  }
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		}
	else
		console.log('not wakable.')


	//upg: preload pics
	let pics = {}

	let id = false
	const next = async n=>{
		console.log({id})
		let i = (id===false)?'':'/'+id
		let f = '/since'+i
		console.log('fff',f)
		try{
			f = await fetch(f)
			console.log(f)
			f = await f.json()
			console.log('anser',f)
			id = f
			
			let a = pics[id]
			console.log({a,pics,id})
			let d = document.querySelector('.display')
			d.innerHTML = ''
			d.appendChild(a)
	
			setTimeout(next,500)
			}
		catch(e){
			console.log(e)
			setTimeout(500) // upg: make signal so we know it's not over timing out?
			}//catch
		}//func


	// prep /////////////
	const prep = n=>new Promise(async (res,rej)=>{
		let f = await fetch('/range')
		f = await f.json()
		let {min,max} = f
		console.log({min,max})
		let l = []
		let c = 0
		for(let i = min; i<=max; i++){
			let ii = i
			let a = document.createElement('img')
			pics[ii] = a
			a.onload = e=>{
				console.log('i.')
				c++
				console.log('ii',{c,max},a.src)
				if(c == max-1){
					console.log('done')
					res(true)
					}
				}
			//upg: on err skip  replace?
			a.src = '/media/'+i
			console.log(a.src)
			}//for
		})//func

	console.log('loading')
	await prep()
	console.log('loaded!')
	console.log('pics',pics)
	next()


	})();
