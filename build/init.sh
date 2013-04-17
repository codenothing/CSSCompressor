#!/bin/bash
cd `dirname $0`
cd ../
npm install
node build/build.js
