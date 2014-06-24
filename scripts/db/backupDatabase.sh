#! /bin/bash

# Creates a local backup of the remote database. The backup folder will be timestamped with the current time and date.
# Please don't commit database backups to git!

database_name="_cosmos_dev_db"
output=$(date +%Y-%m-%d_%H.%M.%S)$database_name

mongodump --host ds030827.mongolab.com --port 30827 -u cosmos-admin -p CS210-l3on1ne! --db cosmos-dev-db --out ${output}

