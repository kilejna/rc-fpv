#!/usr/bin/env bash

#echo "Welcome!~ Enter the following details to setup the program:"

function check_int() {
    num=$1
    if [[ $1 =~ [^0-9] ]] ; then
        return $num ;
    else
        echo "Oopsie woopsie, you did a fucky wucky uwu (input an int)"
        input_value $2
    fi
}

function input_value() {
    direction=$1
    printf "%s" "Input pin number for '$1' direction: "
    read $1
    input=$1
    check_int $input $direction
    echo $?
    return $?
}
input_value forwards
forwards=$?
echo $forwards
: 'printf "%s" "Input pin number for 'forwards' direction: "
read forwards
    if 
printf "%s" "Input pin number for 'backwards' direction: "
read backwards
printf "%s" "Input pin number for 'left' direction: "
read left
printf "%s" "Input pin number for 'right' direction: "
read right'
printf "%s" "Input serial port: "
read serialPort
printf "%s" "Input desired webserver port number: "
read serverPort

echo "{\"pinNumbers\": [$forwards, input_value left, input_value backwards, input_value right], \"serialPort\": \"$serialPort\", \"serverPort\": $serverPort}" | cat  > config.json
: '
npm run build:server
npm run build:client
npm run start:server'