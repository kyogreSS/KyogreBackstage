/**
 * Created by hjx on 2017/10/10.
 */
var WebSocketServer = require("ws")
var wss = new WebSocketServer.Server({
	port: 3002,
	verifyClient: socketVerify,
	clientTracking: true
})

function socketVerify(info) {
	console.log(info.origin)
	console.log(info.req.t)
	console.log(info.secure)
	return true
}

wss.broadcast = function (data) {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocketServer.OPEN) {
			client.send("bbb", data)
		}
	})
}

wss.on("connection", function (ws) {
	console.log("a socket connected!!")
	ws.on("message", function (sourceData) {
		let data = null
		try {
			data = JSON.parse(sourceData)
		} catch (e) {
			data = sourceData
		}

		if (typeof data !== "object" && !data.key) {
			return
		}


		if (data.key === "ChatMessage") {
			wss.clients.forEach(function (client) {
				if (client.readyState === WebSocketServer.OPEN) {
					client.send(JSON.stringify(data))
				}
			})
		}
		if (data.key === "LoginIn") {
			if (data.data && data.data.uuid && data.data.name) {
				ws.uuid = data.data.uuid
				ws.userName = data.data.name
			}
			wss.clients.forEach((client) => {
				if (client !== ws && client.readyState === WebSocketServer.OPEN) {
					let newData = {}
					newData.key = "NewUser"
					newData.data = data.data
					client.send(JSON.stringify(newData))
				}
			})
			let obj = {}
			obj.key = "LoginIn"
			obj.data = {}
			obj.data.messageType = 1
			obj.data.userNumber = wss.clients.size
			ws.send(JSON.stringify(obj))
		}
	})

	ws.on("close", (code, reason) => {
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocketServer.OPEN) {
				let newData = {}
				newData.key = "UserExit"
				newData.data = {}
				newData.data.userNumber = wss.clients.size
				newData.data.userName = ws.userName
				client.send(JSON.stringify(newData))
			}
		})
	})

})