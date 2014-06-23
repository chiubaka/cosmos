#! /bin/bash

database_name="_cosmos_dev_db"
output=$(date +%Y-%m-%d_%H.%M.%S)$database_name
echo $output

mongodump --host ds030827.mongolab.com --port 30827 -u cosmos-admin -p CS210-l3on1ne! --db cosmos-dev-db --out ${output}

