# LRM

Spustenie dockeru :
```bash
docker-compose up --build
```

Zobrazenie obsahu databázy priamo cez príkazový riadok v Docker kontajneri :

```bash
docker exec -it news-db psql -U postgres -d NewsPortal
```

