import express from 'express'
import { Server as HTTPServer } from 'http'
import pkg from 'johnny-five'
import path from 'path'
import { Server as SocketIOServer } from 'socket.io'
import { fileURLToPath } from 'url'

const { Board, Relay } = pkg

export type Keys = 'w' | 'a' | 's' | 'd'

export const initRelay = (pin: number) => new Relay(pin)

export const initRelays = (pins: number[]) => pins.map((pin) => initRelay(pin))

const app = express()
const httpServer: HTTPServer = new HTTPServer(app)
const io = new SocketIOServer(httpServer)
const board = new Board({ port: '/dev/ttyACM0' })

board.on('ready', () => {
	console.log(`${board.id} ready: ${board.isReady}`)

	const relays = {
		w: initRelay(2),
		s: initRelay(3),
		a: initRelay(4),
		d: initRelay(5),
	}

	io.on('connection', (socket) => {
		console.log('Client connected.')

		socket.on('key', ({ key, toggle }) => {
			if (relays[key as Keys].isOn === toggle) return
			toggle ? relays[key as Keys].close() : relays[key as Keys].open()
			console.log(`${key}: ${toggle}`)
		})
	})
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcPath = path.join(__dirname, '../../client/src')
const scriptPath = path.join(__dirname, '../../client/dist')

app.use(express.static(srcPath))
app.use('/dist', express.static(scriptPath))

const PORT = 3000
httpServer.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
