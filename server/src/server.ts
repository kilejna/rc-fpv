import { KeyMessage, PinNumbers, Pins, ServerConfiguration } from '@types'
import express from 'express'
import { Server as HTTPServer } from 'http'
import path from 'path'
import { Server as SocketIOServer } from 'socket.io'
import { fileURLToPath } from 'url'
// johnny-five default export
import pkg from 'johnny-five'
const { Board, Pin } = pkg

const serverConfiguration: ServerConfiguration = {
	pinNumbers: [2, 3, 4, 5],
	serialPort: '/dev/ttyACM0',
	serverPort: 3000,
}

const initPin = (pinNumber: number): InstanceType<typeof Pin> => new Pin(pinNumber)

const initPins = (pinNumbers: PinNumbers) => {
	const pins: Partial<Pins> = {}
	const keys = ['w', 'a', 's', 'd']
	// map keys (direction) to pin number
	pinNumbers.forEach((pinNumber, index) => {
		pins[keys[index]] = initPin(pinNumber)
	})
	return pins
}

const initBoard = (port: string): InstanceType<typeof Board> => new Board({ port })

const initExpressServer = (): HTTPServer => {
	const app = express()
	const __dirname = path.dirname(fileURLToPath(import.meta.url))
	const srcPath = path.join(__dirname, '../../client/src')
	const scriptPath = path.join(__dirname, '../../client/dist')

	app.use(express.static(srcPath))
	app.use('/dist', express.static(scriptPath))

	return new HTTPServer(app)
}

const initSocketIOServer = (httpServer: HTTPServer, pins: Pins): void => {
	const io = new SocketIOServer(httpServer)

	io.on('connect', (socket) => {
		console.log('Client connected.')

		socket.on('key', (message: KeyMessage) => {
			const pin = pins[message.key]
			if (pin) {
				message.toggle ? pin.high() : pin.low()
			}
		})
	})
}

const runServer = (pinNumbers: PinNumbers, serialPort: string, serverPort: number): void => {
	const board = initBoard(serialPort)

	board.on('ready', () => {
		const pins = initPins(pinNumbers)
		console.log(`${board.id} ready: ${board.isReady}`)

		const httpServer = initExpressServer()
		httpServer.listen(serverPort, () => {
			console.log(`Server listening on port ${serverPort}.`)
		})

		initSocketIOServer(httpServer, pins)
	})
}

runServer(serverConfiguration.pinNumbers, serverConfiguration.serialPort, serverConfiguration.serverPort)
