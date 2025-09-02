#!/usr/bin/env bash

until pg_isready -U $POSTGRESQL_USERNAME -d $POSTGRESQL_DATABASE >/dev/null 2>&1; do
    echo "Waiting for PostgreSQL to be ready...";
    sleep 2;
done