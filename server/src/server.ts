import { KeyMessage, PinNumbers, ServerConfiguration } from '@types'
import express from 'express'
import { Server as HTTPServer } from 'http'
import pkg from 'johnny-five'
import path from 'path'
import { Server as SocketIOServer } from 'socket.io'
import { fileURLToPath } from 'url'
//import serverConfiguration from '../../config.json' assert {type: json}
//const { default: data } = await import('../../config.json', { assert: { type: "json" } });

const { Board, Pin } = pkg

type Pins = {
	w: pkg.Pin
	a: pkg.Pin
	s: pkg.Pin
	d: pkg.Pin
}

const serverConfiguration: ServerConfiguration = {
	pinNumbers: [2, 3, 4, 5],
	serialPort: '/dev/ttyACM0',
	serverPort: 3000,
}

//const { pinNumbers, serialPort, serverPort } = data as ServerConfiguration
const { pinNumbers, serialPort, serverPort } = serverConfiguration

const initPin = (pin: number) => new Pin(pin)

const initPins = (pinNum: PinNumbers) => {
	const pins = pinNum.map((pin) => initPin(pin))
	const [w, a, s, d] = pins
	return {
		w,
		a,
		s,
		d,
	}
}

const initBoard = (port: string) => new Board({ port: port })

const initExpressServer = () => {
	// init server
	const app = express()
	const httpServer = new HTTPServer(app)

	// set file paths
	const __dirname = path.dirname(fileURLToPath(import.meta.url))
	const srcPath = path.join(__dirname, '../../client/src')
	const scriptPath = path.join(__dirname, '../../client/dist')

	// serve static files
	app.use(express.static(srcPath))
	app.use('/dist', express.static(scriptPath))

	return httpServer
}

const initSocketIOServer = (httpServer: HTTPServer, pins: Pins) => {
	const io = new SocketIOServer(httpServer)
	io.on('connect', (socket) => {
		console.log('Client connected.')

		socket.on('key', (args: KeyMessage) => {
			args.toggle ? pins[args.key].high() : pins[args.key].low()
		})
	})
}

const runServer = (pinNums: PinNumbers, serialPort: string, serverPort: number) => {
	const httpServer = initExpressServer()
		httpServer.listen(serverPort, () => {
			console.log(`Server listening on port ${serverPort}.`)
		})

	const board = initBoard(serialPort)

	board.on('ready', () => {
		const pins = initPins(pinNums)
		console.log(`${board.id} ready: ${board.isReady}`)

		const httpServer = initExpressServer()
		httpServer.listen(serverPort, () => {
			console.log(`Server listening on port ${serverPort}.`)
		})

		initSocketIOServer(httpServer, pins)
	})
}

runServer(pinNumbers, serialPort, serverPort)
