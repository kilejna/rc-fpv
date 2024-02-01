#!/usr/bin/env bash

function check_int() {
    direction=$2
    echo $direction
    if [[ $1 == "" ]]
    then
        echo "Input an int"
        input_value $2
    elif [[ $1 =~ ^[0-9]+$ || $1 =~ ^[-][0-9]+$  ]]
    then
        echo "pin num is $1"
        return $1
    else
        echo "Oopsie woopsie, you did a fucky wucky uwu (input an int)"
        input_value $direction
    fi
}

function input_value() {
    direction=$1
    #printf "%s" "Input pin number for '$1' direction: "
    read -p "Input pin number for '$1' direction: " num
    check_int $num $1
}

input_value forwards
forwards=$?
#echo $forwards