#!/bin/bash

DB_CONNECTION_STRING=$(grep 'DATABASE_URL' .env | cut -d '=' -f 2- | tr -d '"')

if [ ! -z "$DB_CONNECTION_STRING" ]; then
    DB_USER=$(echo $DB_CONNECTION_STRING | sed -e 's/.*:\/\/\([^:]*\):.*/\1/')
    DB_PASS=$(echo $DB_CONNECTION_STRING | sed -e 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/')
    DB_NAME=$(echo $DB_CONNECTION_STRING | sed -e 's/.*\/\([^?]*\)?.*/\1/')
    DB_PORT=$(echo $DB_CONNECTION_STRING | sed -e 's/.*@.*:\([0-9]*\)\/.*/\1/')
    
    echo "Banco:   $DB_NAME"
    echo "Usuário: $DB_USER"
    echo "Senha:   $DB_PASS"
    echo "Senha:   $DB_PORT"
else
  echo "Arquivo .env não encontrado, saindo..."
  exit 0
fi

# Nome do container
container_name="${DB_NAME}_postgres"

# Verifica se o container já existe
if podman container exists $container_name; then
  echo "Container já existe."

  if [[ "$(podman inspect -f '{{.State.Running}}' $container_name)" == "false" ]]; then
    echo "Iniciando o container..."
    podman start $container_name
  else
    echo "Container já está rodando."
  fi
else
  echo "Criando e iniciando um novo container PostgreSQL..."

  podman run --name $container_name \
    -e POSTGRES_USER=${DB_USER} \
    -e POSTGRES_DB=${DB_NAME} \
    -e POSTGRES_PASSWORD=${DB_PASS} \
    -p 5432:5432 \
    -d postgres:15.0
fi
