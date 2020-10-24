#!/bin/bash
rm -rf .git && git init
npm i
mv example.env .env