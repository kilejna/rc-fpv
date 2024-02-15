import { KeyMessage, Keys, VideoDevice } from '@types'
import { io as IO } from 'socket.io-client'

declare const io: typeof IO

const video = document.getElementById('video-container') as HTMLVideoElement // video element
const deviceSelector = document.getElementById('device-list') as HTMLSelectElement // select elemnet
const mediaContainer = document.getElementById('media-container') as HTMLElement // media container element
const socket = io('http://localhost:3000')

const getStream = async (videoDeviceID: string | undefined) => {
	if (!video || videoDeviceID === 'default') {
		video.className = 'hidden'
		return
	}

	try {
		const mediaStream = await navigator.mediaDevices.getUserMedia({
			video: { deviceId: videoDeviceID, height: 480, width: 640 },
		})
		video.srcObject = mediaStream
		video.className = 'object-contain'
		video.onloadedmetadata = () => video.play()
		if (!mediaContainer.contains(video)) {
			mediaContainer.appendChild(video)
		}
	} catch (error) {
		handleError(error)
	}
}

const getDeviceList = async (): Promise<VideoDevice[]> => {
	try {
		await navigator.mediaDevices.getUserMedia({ video: true })
		const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices()
		const videoDevices: MediaDeviceInfo[] = devices.filter((device: MediaDeviceInfo) => device.kind === 'videoinput')

		return videoDevices.map((device: MediaDeviceInfo, index: number) => ({
			value: device.deviceId,
			text: device.label || `Video Device ${index + 1}`,
		}))
	} catch (error) {
		handleError(error)
		return [{ value: 'null', text: '-- No Video Source Found --', selected: true }]
	}
}

const populateOptions = (deviceList: VideoDevice[]) => {
	deviceSelector.innerHTML = deviceList.reduce(
		(acc: string, device: VideoDevice) => acc + `<option value="${device.value}" ${device.selected ? 'selected' : ''}>${device.text}</option>`,
		''
	)
}

const sendKeyState = (key: Keys, toggle: boolean) => {
	const message: KeyMessage = { key, toggle }
	socket.emit('key', message)
}

const toggleButton = (key: Keys, toggle: boolean) => {
	const button: HTMLElement | null = document.getElementById(`${key}-button`)
	const oppositeKey: string = { w: 's', a: 'd', s: 'w', d: 'a' }[key]
	const oppositeButton: HTMLElement | null = document.getElementById(`${oppositeKey}-button`)

	if (!button || oppositeButton?.getAttribute('aria-pressed') === 'true') return

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
	const devices: VideoDevice[] = await getDeviceList()
	populateOptions([{ value: 'default', text: '-- Select Video Source --', selected: true }, ...devices])

	deviceSelector.addEventListener('change', (event: Event) => {
		const videoId: string = (event.target as HTMLSelectElement).value
		getStream(videoId)
	})

	const keyEvent = (event: KeyboardEvent, toggle: boolean) => {
		const key = event.key.toLowerCase() as Keys
		if (['w', 's', 'a', 'd'].includes(key)) {
			toggleButton(key, toggle)
		}
	}

	document.addEventListener('keydown', (event: KeyboardEvent) => keyEvent(event, true))
	document.addEventListener('keyup', (event: KeyboardEvent) => keyEvent(event, false))
})
