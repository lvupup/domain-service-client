#!/bin/bash

SH_DIR="$(cd "$(dirname "$0")"; pwd -P)"
sh $SH_DIR/../cicd-reference/scripts/build-db-images.sh stop -t=local
