import { KeyMessage, Keys } from '@types'
declare const io: any // eslint-disable-line @typescript-eslint/no-explicit-any

const getMediaDevices = () => {
	const dropDown: HTMLSelectElement | null = document.querySelector('#devices')
	let firstDevice: string = ''
	if (dropDown) {
		const videoDevices: MediaDeviceInfo[] = []
		navigator.mediaDevices
			.enumerateDevices()
			.then((allDevices) =>
				allDevices.map((device, index: number) => allDevices[index].kind === 'videoinput' && videoDevices.push(allDevices[index]))
			)
			.then(() => {
				if (videoDevices.length < 1) {
					dropDown.innerHTML = `<option selected value="undefined">-- No Video Source Found --</option>`
				} else {
					dropDown.innerHTML = `
			${videoDevices
				.map(
					(device, index) =>
						`<option ${index === 0 && 'selected'} value="${device.deviceId}">  ${device.label || `  Video Device ${index}  `}</option>`
				)
				.join('')}`
					firstDevice = videoDevices[0].deviceId
				}
			})
	}
	return firstDevice
}

const getFirstDevice = async () => getMediaDevices()
console.log(await getFirstDevice())

const getStream = (videoDeviceID: ConstrainDOMString | undefined) => {
	const video: HTMLVideoElement | null = document.querySelector('#video')
	const selectedVideo: HTMLSelectElement | null = document.querySelector('#devices')
	console.log(selectedVideo && selectedVideo.item(0))
	//selectedVideo && selectedVideo.selectedIndex

	if (video && videoDeviceID) {
		navigator.mediaDevices
			.getUserMedia({ video: { deviceId: videoDeviceID } })
			.then((mediaStream) => {
				video.srcObject = mediaStream
				video.onloadedmetadata = () => {
					video.play()
				}
			})
			.catch((err) => {
				console.error(`${err.name}: ${err.message}`)
			})
	} else if (video) {
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
	getMediaDevices()
	// connect to socket
	//const socket = io('http://localhost:3000')
	setTimeout(() => {
		readSelectValue();
	  }, 0);
	

	// get webcam
	//getStream()

	// handle socket messages
	const sendKeyState = (key: Keys, toggle: boolean) => {
		const message: KeyMessage = { key, toggle }
		//socket.emit('key', message)
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

const readSelectValue = () => {
	const selectedVideo = document.querySelector('#devices') as HTMLSelectElement

		if (selectedVideo) {
			//getStream(video)

    const selectedValue = selectedVideo.value;
    console.log('Selected value on page load:', selectedValue);
    // Perform any additional actions with the selectedValue
			selectedVideo.addEventListener('change', (event): void => {
				const videoId: ConstrainDOMString | undefined = (event?.target as HTMLSelectElement).value || undefined
				console.log(videoId)
				getStream(videoId)
			})
		}
} 