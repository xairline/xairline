. .env
TYPEORM_ENTITIES=libs/api/$1/src/*.entity.ts \
    TYPEORM_CONNECTION=postgres \
    TYPEORM_URL=$HEROKU_POSTGRESQL_JADE_URL \
    TYPEORM_DRIVER_EXTRA='{"ssl":{"rejectUnauthorized":false}}' \
    yarn typeorm migration:generate -n $2 \
    -d libs/api/$1/src/migrations