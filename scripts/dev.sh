#!/bin/bash

NAME="userapi"
CONTAINER="${NAME}_postgres"
SCRIPT_PATH="$(dirname "$(realpath "$0")")"
PROJECT_PATH="$(dirname $SCRIPT_PATH)"
VISUAL="${VISUAL:-code}"
BROWSER="${BROWSER:-firefox}"

# Inicializa variáveis para indicar se os parâmetros foram passados
t_flag=false
p_flag=false
b_flag=false

# Função para definir os flags com base no parâmetro
set_flag() {
    case $1 in
        t)
            t_flag=true
            ;;
        p)
            p_flag=true
            ;;
        b)
            b_flag=true
            ;;
        *)
            echo "Opção desconhecida: -$1"
            ;;
    esac
}

for arg in "$@"
do
    if [[ $arg == -* ]]; then
        for (( i=1; i<${#arg}; i++ )); do
            set_flag "${arg:$i:1}"
        done
    fi
done

if [ "$p_flag" == true ] || [ "$#" -eq 0 ]; then
    if podman inspect "$CONTAINER" > /dev/null 2> /dev/null; then
        if podman container inspect -f '{{.State.Running}}' $CONTAINER | grep false; then
            podman start $CONTAINER
        fi
    fi
fi

if [ "$t_flag" == true ] || [ "$#" -eq 0 ]; then
    if ! tmux has-session -t $NAME 2> /dev/null; then
        \tmux -f ${PROJECT_PATH}/scripts/.tmux.conf new-session -A -d -s $NAME -n project
        \tmux send-keys -t $NAME:project "cd ${PROJECT_PATH} ; clear" ENTER

        \tmux new-window -t $NAME -n api -d
        \tmux send-keys -t $NAME:api "clear ; cd ${PROJECT_PATH} ; bun src/api.ts" ENTER
    fi
fi

if [ "$b_flag" == true ] || [ "$#" -eq 0 ]; then
    $BROWSER 'https://bun.sh' 'https://hono.dev' 'https://grammy.dev' 'https://github.com/sistematico/macunaima-telegram-bot/' 'https://chat.openai.com' 'http://localhost:5173' &
fi

$VISUAL ${PROJECT_PATH}
