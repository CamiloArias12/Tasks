#!/bin/sh
# TODO: Check if the script is running on docker container or outside.
echo "Installing bash..."
apk add bash

echo "Installing dependiencies"
corepack enable
yarn install

yarn dev:all