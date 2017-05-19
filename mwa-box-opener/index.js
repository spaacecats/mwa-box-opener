const MWABOX = 166901
module.exports = function mwaBoxOpener(dispatch){
	let	cid = null,
		enabled = false,
		location = null,
		timer = null,
		inventory = null;
		
	dispatch.hook('S_LOGIN', 1, event =>{cid = event.cid})
	dispatch.hook('C_PLAYER_LOCATION', 1, event =>{location = event})
	
	dispatch.hook('C_CHAT', 1, event => {
		if(/^<FONT>!mwa<\/FONT>$/i.test(event.message)) {
			if(enabled = !enabled) {
				message(' MWA box opener started.')
				timer = setInterval(openBox,200)
			}
			else
				stop()
			return false
		}
	})
	
	dispatch.hook('S_INVEN', 3, event =>{
		if(!enabled) return

		if(event.first) inventory = []
		else if(!inventory) return

		for(let item of event.items) inventory.push(item)

		if(!event.more) {
			let box = false
		for(let item of inventory) {
				if(item.slot < 40) continue 
				if(item.item == MWABOX) box = true
		}
		if(!box) stop()

			inventory = null
		}
	})
	function openBox() {
		dispatch.toServer('C_USE_ITEM', 1, {
			ownerId: cid,
			item: MWABOX,
			id: 0,
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: 1,
			unk5: 0,
			unk6: 0,
			unk7: 0,
			x: location.x1,
			y: location.y1,
			z: location.z1,
			w: location.w,
			unk8: 0,
			unk9: 0,
			unk10: 0,
			unk11: 1
		})
		dispatch.toServer('C_GACHA_TRY', 1,{
			id:385851
		})
	}
	function stop() {
		clearInterval(timer)
		enabled = false
		inventory = null
		message(' MWA box opener stopped.')
		}	
	function message(msg) {
		dispatch.toClient('S_CHAT', 1, {
			channel: 24,
			authorID: 0,
			unk1: 0,
			gm: 0,
			unk2: 0,
			authorName: '',
			message: '(Proxy)' + msg
		})
	}					
}