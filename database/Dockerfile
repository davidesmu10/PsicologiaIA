FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=StrongPassw0rd!2026

USER root

COPY init.sql /scripts/init.sql

CMD /bin/bash -c "\
/opt/mssql/bin/sqlservr & \
echo 'Waiting SQL Server...' && \
for i in {1..40}; do \
  /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P 'StrongPassw0rd!2026' \
    -C \
    -N \
    -Q 'SELECT 1' && break || \
  sleep 3; \
done && \
echo 'Running init script...' && \
/opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P 'StrongPassw0rd!2026' \
  -C \
  -N \
  -i /scripts/init.sql && \
wait"