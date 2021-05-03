docker run \
    -p 3306:3306 \
    --name mysql-mariadb \
    -e MYSQL_ROOT_PASSWORD=root \
    -d mariadb