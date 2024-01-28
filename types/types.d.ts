export type Keys = 'w' | 'a' | 's' | 'd'

export type KeyMessage = {
	key: Keys
	toggle: boolean
}

export type PinNumbers = [number, number, number, number]

export type ServerConfiguration = {
	pinNumbers: PinNumbers
	serialPort: string
	serverPort: number
}
