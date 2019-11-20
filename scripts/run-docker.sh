#!/usr/bin/env bash

set -e
cd $(dirname ${BASH_SOURCE[0]})

./compose.sh up -d --build
