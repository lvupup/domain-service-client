FROM mongo:4.4.10
ARG git_commit=unspecified
LABEL git_commit=$git_commit

ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=pass.123

COPY ./database/mongo/setup.js /etc/mongo/setup.js
COPY ./database/mongo/init.js /etc/mongo/init.js
COPY ./database/mongo/mongo-init-setup.sh /docker-entrypoint-initdb.d/mongo-init-setup.sh

CMD [ "--auth", "--quiet", "--bind_ip_all" ]
