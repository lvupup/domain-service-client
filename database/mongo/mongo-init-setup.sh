#!/bin/bash

echo "Executing MongoDB Setup..."
mongo -u root -p pass.123 < /etc/mongo/setup.js
echo "Setup Completed!"

echo "Executing MongoDB Init..."
mongo -u root -p pass.123 < /etc/mongo/init.js
echo INIT_DATA_DONE >> /tmp/dbstatus
echo "Init Completed!"
