#!/bin/bash

help() {
    cat << EOF >&2

Usage: 
    sh build-db-images.sh [Command] [Options]
    
Commands:
    start       Start up services you choose
    stop        Stop services you choose
    build       Build docker images
    push        Push docker images to registry

Options:
    -h          Print Help (this message) and exit
    -t=<tag>    Docker image tag

EOF
}

main() {
    checkWorkspace
    loadArguments "$@"
    
    set -ex
    execute_action
}

checkWorkspace() {
    if [[ "`pwd`" == *"scripts"* ]]; then
        cd ../../
    fi
}

execute_action() {
    case "$ACTION" in
        start)
            docker-compose -p "database-$APP_NAME" -f "./database/docker-compose.db.yml" -f "./database/docker-compose.yml" down -v
            docker-compose -p "database-$APP_NAME" -f "./database/docker-compose.db.yml" -f "./database/docker-compose.yml" up \
                --build \
                --always-recreate-deps
            ;;
        stop)
            docker-compose -p "database-$APP_NAME" -f "./database/docker-compose.db.yml" -f "./database/docker-compose.yml" down -v
            ;;
        build)
            git_commit=${GITCOMMIT} docker-compose -f "./database/docker-compose.db.yml" -f "./database/docker-compose.yml" build
            ;;
        push)
            docker-compose -f "./database/docker-compose.db.yml" -f "./database/docker-compose.yml" push
            ;;
    esac
}

loadArguments() {
    # Load from file
    source "./build/build-image.properties"
    export DB_TAG="latest"
    GITCOMMIT="$(git log -1 --format=%H)"

    while [ $# -gt 0 ]; do
        case "$1" in
            -h)
                help
                exit 1
                ;;
            start)
                ACTION="start"
                ;;
            stop)
                ACTION="stop"
                ;;
            build)
                ACTION="build"
                ;;
            push)
                ACTION="push"
                ;;
            -t=*)
                export DB_TAG="${1#*=}"
                ;;
            *)
                help
                exit 1
        esac
        shift
    done

    if [ "$ACTION" == "" ]; then
        help
        exit 1
    fi
    
    set -ex
}

main "$@"
