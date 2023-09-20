#!/bin/bash

# cd venv
# cd Scripts

# . activate

# cd ../../


k6 run --out csv=data.csv user.js
# k6 run --out csv=data.csv one.user.js

python script.py