# RC-FPV Project   ![favicon-32x32](https://github.com/kilejna/rc-fpv/assets/60970177/4f5c35b9-8a59-4470-a43e-a4978d5aa47f)

## Description

RC-FPV (Remote Control First Person View) is a project aimed at creating an immersive remote control experience. Using modern web technologies, users can control an RC device, such as a car or drone, and receive a real-time video feed right in their browser. This project integrates hardware control with a web interface for a seamless user experience.

Support for gamepad controllers using the GamePad API will be added in the future.

## Features

- Real-time control of RC devices.
- First Person View video streaming.
- Responsive web interface for keyboard and gamepad controllers.

## Requirements

### Hardware

- Serial Device (Arduino)
- Relay Board
- RC Device
- FPV Camera (UVC/OTG)
- Host Device
- TBA...

### Dependancies

#### Client (Frontend)

- socket.io-client
- tailwindcss
- autoprefixer
- postcss

#### Server (Backend)

- express
- firmata
- johnny-five
- socket.io

## Installation

1. Change BoardPort in `server.ts` to your COM or Board Port
   
	ProTip: You can easily find your boardPort using the Arduino IDE or using "ls /dev/tty.*" if you're on OSX
```ts
const serverConfiguration: ServerConfiguration = {
	pinNumbers: [2, 3, 4, 5],
	boardPort: '/dev/ttyACM0',
	serverPort: 3000,
}
```

2. Install dependancies:

```bash
npm i
npm run install:server
npm run install:client
```

3. Build project:

```bash
npm run build:server
npm run build:client
npm run build:css
```

5. Run server:

```bash
npm run start:server
```

6. Open this address in your browser:

```
http://localhost:3000/
````

## License

RC-FPV is licensed under the [ISC License](LICENSE).

## Contact

For any additional information, feel free to contact us at [kilejna@hotmail.com](mailto:kilejna@hotmail.com).

## Acknowledgements

Any individuals, organisations and communities that contribute to the maintanence of libraries.
