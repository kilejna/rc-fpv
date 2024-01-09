declare const io: any // eslint-disable-line @typescript-eslint/no-explicit-any

type Keys = 'w' | 's' | 'a' | 'd'

type KeyMessage = {
	key: Keys
	toggle: boolean
}

document.addEventListener('DOMContentLoaded', () => {
	const socket = io('http://localhost:3000')

	// Function to handle sending messages
	const sendKeyState = (key: Keys, toggle: boolean) => {
		const message: KeyMessage = { key, toggle }
		socket.emit('key', message)
	}

	// Keydown event
	document.addEventListener('keydown', (event: KeyboardEvent) => {
		const key = event.key.toLowerCase()
		switch (key) {
			case 'w':
			case 's':
			case 'a':
			case 'd':
				sendKeyState(key, true)
		}
	})

	// Keyup event
	document.addEventListener('keyup', (event: KeyboardEvent) => {
		const key = event.key.toLowerCase()
		switch (key) {
			case 'w':
			case 's':
			case 'a':
			case 'd':
				sendKeyState(key, false)
		}
	})
})
