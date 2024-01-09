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

- Serial Device
- Relays
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

1. Configure arduino port in ```server.ts```:
```ts
const board = new Board({ port: /* your port */ })
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

4. Run server:

```bash
npm run start:server
```

## License

RC-FPV is licensed under the [ISC License](LICENSE).

## Contact

For any additional information, feel free to contact us at [kilejna@hotmail.com](mailto:kilejna@hotmail.com).

## Acknowledgements

- Any individuals, organisations and communities that contribute to the maintanence of libraries.
