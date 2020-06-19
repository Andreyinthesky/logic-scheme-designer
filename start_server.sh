!bin/bash
if ! [ -d ./node_modules ]; then
        npm i
fi

export NODE_ENV=production

node server.js

unset NODE_ENV
