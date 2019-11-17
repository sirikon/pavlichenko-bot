#!/usr/bin/env bash

set -e
cd $(dirname ${BASH_SOURCE[0]})/..

docker-compose -p pavlichenko-bot-devenv -f ./docker/docker-compose.yml $@
