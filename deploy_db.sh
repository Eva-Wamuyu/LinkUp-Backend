#!/bin/bash

set -euo pipefail

# can be linked from env 
SERVER="localhost,1433" # or whatever the server is
DATABASE="LINKUP"
USER=""
PASSWORD=""

INIT_SQL="path to init.sql" # actual path of the init.sql from where one is running

# Find sqlcmd from PATH
SQLCMD="$(command -v sqlcmd || true)"
if [[ -z "$SQLCMD" ]]; then
  echo "ERROR: sqlcmd not found in PATH."
  echo "Try: ls -l /opt/mssql-tools*/bin/sqlcmd"
  exit 1
fi

# :r includes are resolved relative to sqlcmd current working directory.
cd "$(dirname "$INIT_SQL")"

# Run
"$SQLCMD" -S "$SERVER" -d "$DATABASE" -U "$USER" -P "$PASSWORD" -i "$(basename "$INIT_SQL")" 

# or this ....
# "$SQLCMD" -S "$SERVER" -d "$DATABASE" -U "$USER" -P "$PASSWORD" -C -i "$(basename "$INIT_SQL")"

echo "Database deployed successfully!"
