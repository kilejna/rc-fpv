# RC-FPV Project

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
- FPV Camera
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

1. Edit serverConfiguration in `server.ts`:

```ts
const serverConfiguration: ServerConfiguration = {
	pinNumbers: [2, 3, 4, 5],
	boardPort: '/dev/ttyACM0',
	serverPort: 3000,
}
```
   #### (Skip this step if you have only one camera connected to your device)
2. Edit clientConfiguration in `client.ts`:

   
   In line 8, add or uncomment the code below;
   
```ts
   console.log(navigator.mediaDevices.enumerateDevices())
```
   Install dependancies, build and run the server. (Step 3,4,5)
   
   Check the console log for your cameras deviceId.
   
   Edit line 10-12 with the code below;

```ts
   .getUserMedia({ video: {
		deviceId: 'YourDeviceIdGoesHere',
			}})
```

Continue following the next steps:


3. Install dependancies:

```bash
npm i
npm run install:server
npm run install:client
```

4. Build project:

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

- Any individuals, organisations and communities that contribute to the maintanence of libraries.
