export type Directions = 'forwards' | 'backwards' | 'left' | 'right'

export type Keys = 'w' | 'a' | 's' | 'd'

export type RelayObject = Record<Directions, { keys: Keys; toggle: boolean }>
