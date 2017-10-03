#!/usr/bin/env bash
set -e

img_size() {
 for p in "$@"
 do
   echo "$p"
   sips -g pixelWidth "$p" | tail -n1
   sips -g pixelHeight "$p" | tail -n1
 done
}

rm ./screenshots/* || true
rm ./container/* || true

NODE_ENV=development DEBUG=fullscreenshot yarn test:local
img_size ./screenshots/*

docker-compose up
docker-compose rm -f
img_size ./container/*