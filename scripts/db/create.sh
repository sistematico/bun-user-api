#!/bin/bash

DB_CONNECTION_STRING=$(grep 'DATABASE_URL' .env | cut -d '=' -f 2- | tr -d '"')

if [ ! -z "$DB_CONNECTION_STRING" ]; then
    DB_USER=$(echo $DB_CONNECTION_STRING | sed -e 's/.*:\/\/\([^:]*\):.*/\1/')
    DB_PASS=$(echo $DB_CONNECTION_STRING | sed -e 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/')
    DB_NAME=$(echo $DB_CONNECTION_STRING | sed -e 's/.*\/\([^?]*\)?.*/\1/')
    
    echo "Banco:   $DB_NAME"
    echo "Usuário: $DB_USER"
    echo "Senha:   $DB_PASS"
fi

does_db_exist() { 
    su - postgres -c "psql -lqt | cut -d \| -f 1 | grep -qw $1" 
}

if does_db_exist $DB_NAME; then
    echo "O banco de dados $DB_NAME já existe. O script não será executado."
    exit 0
fi

su - postgres -c "psql -c \"CREATE USER $DB_USER WITH PASSWORD '$DB_PASS' SUPERUSER;\""
su - postgres -c "psql -c \"CREATE DATABASE $DB_NAME WITH OWNER $DB_USER;\""
#su - postgres -c "psql -c \"ALTER USER $DB_USER WITH SUPERUSER;\""

echo "Configuração do banco de dados para Prisma concluída."