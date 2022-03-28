#!/bin/sh

execConsul() {
  consul agent -dev -client 0.0.0.0
}

initConsul() {
  let "timeout = $(date +%s) + 100"

  echo "Wait for consul service to start"
  while ! curl -f -s http://localhost:8500/v1/status/leader | grep "[0-9]:[0-9]"; do
    if [ $(date +%s) -gt $timeout ]; then echo "Waiting timeout"; exit 1; fi
    sleep 1
    echo "Still waiting..."
  done

  echo "Init KV store from $INIT_CONSUL_KV_DIR"
  cd $INIT_CONSUL_KV_DIR
  for json_file in $(ls *.json); do
    key=$(echo $json_file | sed -e 's/.json$//')
    echo "Init $key from $json_file"
    consul kv get $key >/dev/null && echo "$key is already initialized" || consul kv put $key @$json_file
  done

  echo "Init Completed!"
}

execConsul & initConsul & wait
