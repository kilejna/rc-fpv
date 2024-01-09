import { KeyMessage, Keys } from '@types'
declare const io: any // eslint-disable-line @typescript-eslint/no-explicit-any

const getStream = () => {
	const video: HTMLVideoElement | null = document.querySelector('#video')

	if (navigator.mediaDevices.getUserMedia && video) {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((mediaStream) => {
				video.srcObject = mediaStream
				video.onloadedmetadata = () => {
					video.play()
				}
			})
			.catch((err) => {
				console.error(`${err.name}: ${err.message}`)
			})
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// connect to socket
	const socket = io('http://localhost:3000')

	// get webcam
	getStream()

	// handle socket messages
	const sendKeyState = (key: Keys, toggle: boolean) => {
		const message: KeyMessage = { key, toggle }
		socket.emit('key', message)
	}

	// toggle button logic
	const toggleButton = (key: Keys, toggle: boolean) => {
		const button = document.getElementById(`${key}_button`)
		if (!button) return

		// onKeyUp, toggle off
		if (!toggle) {
			button.setAttribute('aria-pressed', 'false')
			sendKeyState(key, false)
			return
		}

		// define key conflicts
		const conflicts = { w: 's', s: 'w', a: 'd', d: 'a' } // w != s || a != d
		const conflict = conflicts[key]
		const conflictButton = conflict ? document.getElementById(`${conflict}_button`) : null

		// onKeydown, check conflicts
		if (conflictButton && conflictButton.getAttribute('aria-pressed') === 'true') return

		// toggle on if no conflicts
		button.setAttribute('aria-pressed', 'true')
		sendKeyState(key, true)
	}

	// keydown listener
	document.addEventListener('keydown', (event: KeyboardEvent) => {
		const key = event.key.toLowerCase()
		switch (key) {
			case 'w':
			case 's':
			case 'a':
			case 'd':
				toggleButton(key, true)
		}
	})

	// keyup listener
	document.addEventListener('keyup', (event: KeyboardEvent) => {
		const key = event.key.toLowerCase()
		switch (key) {
			case 'w':
			case 's':
			case 'a':
			case 'd':
				toggleButton(key, false)
		}
	})
})
