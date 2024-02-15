export type Keys = 'w' | 'a' | 's' | 'd'

export type KeyMessage = {
	key: Keys
	toggle: boolean
}

export type PinNumbers = [number, number, number, number]

export type Pins = Record<string, InstanceType<typeof Pin>>

export type ServerConfiguration = {
	pinNumbers: PinNumbers
	serialPort: string
	serverPort: number
}

export type VideoDevice = {
	value: string
	text: string
	selected?: boolean
}

export type ServerToClientEvents = {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
  }
  
export type ClientToServerEvents = {
	hello: () => void;
  }