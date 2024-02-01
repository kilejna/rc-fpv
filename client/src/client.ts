import { KeyMessage, Keys } from '@types'

declare const io: any // eslint-disable-line @typescript-eslint/no-explicit-any

type VideoDevices = {
	value: string
	text: string
	selected?: boolean
}

const video = document.getElementById('video-container') as HTMLVideoElement // get video element
const deviceSelector = document.getElementById('device-list') as HTMLSelectElement // get device selector element
const mediaContainer = document.getElementById('media-container') as HTMLElement // get media container element
const socket = io('http://localhost:3000') // init socket

// stream selected video device
const getStream = async (videoDeviceID: ConstrainDOMString | undefined) => {
	if (!video) return // if no video element, return

	if (videoDeviceID && videoDeviceID !== 'default') {
		try {
			// get video device
			const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDeviceID, height: 480, width: 640 } })
			// populate video element
			video.srcObject = mediaStream
			video.className = 'object-contain'
			// stream video
			video.onloadedmetadata = () => video.play()
			// append video element if no video element exists in the media container
			if (!mediaContainer.contains(video)) {
				mediaContainer.appendChild(video)
			}
		} catch (error) {
			handleError(error)
		}
	} else {
		video.className = 'hidden'
	}
}

// get list of video devices
const getDeviceList = async (): Promise<VideoDevices[]> => {
	try {
		await navigator.mediaDevices.getUserMedia({ video: true })
		const devices = await navigator.mediaDevices.enumerateDevices() // get all connected media
		const videoDevices = devices.filter((device) => device.kind === 'videoinput') // filter connected devices for video only

		return videoDevices.length === 0
			? [{ value: 'null', text: '-- No Video Source Found --', selected: true }]
			: [
					{ value: 'default', text: '-- Select Video Source --', selected: true },
					...videoDevices.map((device, index) => ({ value: device.deviceId, text: device.label || `Video Device ${index + 1}` })),
				]
	} catch (error) {
		handleError(error)
		return [{ value: 'null', text: '-- No Video Source Found --', selected: true }]
	}
}

// populate the device selector
const populateOptions = (deviceList: VideoDevices[]) => {
	if (!deviceSelector) return
	deviceSelector.innerHTML = ''
	deviceList.forEach((device) => {
		const option = new Option(device.text, device.value, device.selected, device.selected)
		deviceSelector.add(option)
	})
}

const sendKeyState = (key: Keys, toggle: boolean) => {
	const message: KeyMessage = { key, toggle }
	socket.emit('key', message)
}

const toggleButton = (key: Keys, toggle: boolean) => {
	const button = document.getElementById(`${key}-button`)
	if (!button) return

	button.setAttribute('aria-pressed', `${toggle}`)
	sendKeyState(key, toggle)
}

const handleError = (error: unknown) => {
	if (error instanceof Error) {
		console.error(`${error.name}: ${error.message}`)
	} else {
		console.error('An unknown error occurred')
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	try {
		const devices = await getDeviceList()
		populateOptions(devices)

		deviceSelector.addEventListener('change', (event) => {
			const videoId = (event.target as HTMLSelectElement).value
			getStream(videoId)
		})
	} catch (error) {
		handleError(error)
	}

	document.addEventListener('keydown', (event: KeyboardEvent) => {
		const key = event.key.toLowerCase() as Keys
		if (['w', 's', 'a', 'd'].includes(key)) {
			toggleButton(key, true)
		}
	})

	document.addEventListener('keyup', (event: KeyboardEvent) => {
		const key = event.key.toLowerCase() as Keys
		if (['w', 's', 'a', 'd'].includes(key)) {
			toggleButton(key, false)
		}
	})
})
