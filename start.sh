#!/usr/bin/env bash

#echo "Welcome!~ Enter the following details to setup the program:"
printf "%s" "Input pin number for 'forwards' direction: "
read forwards
printf "%s" "Input pin number for 'backwards' direction: "
read backwards
printf "%s" "Input pin number for 'left' direction: "
read left
printf "%s" "Input pin number for 'right' direction: "
read right
printf "%s" "Input serial port: "
read serialPort
printf "%s" "Input desired webserver port number: "
read serverPort

echo "{\"pinNumbers\": [$forwards, $left, $backwards, $left], \"serialPort\": \"$serialPort\", \"serverPort\": $serverPort}" | cat  > config.json
npm run build:server
npm run build:client
npm run start:server'