#!/bin/bash
k6 run --out csv=data.csv user.js

python script.py