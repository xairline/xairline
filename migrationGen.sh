TYPEORM_ENTITIES=libs/electron/$1/src/*.entity.ts \
    TYPEORM_CONNECTION=sqlite \
    TYPEORM_DATABASE=~/Library/Application\ Support/xairline.sqlite \
    yarn typeorm migration:generate -n $2 \
    -d libs/electron/$1/src/migrations