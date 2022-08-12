# Book-catalog

## Getting started

Installing dependencies
```bash
npm i ts-node ts-node-dev typescript @types/node prisma -D
```
```bash
npm i apollo-server graphql @prisma/client
```


Seeding the database
```bash
npx prisma db seed
```

Start the server
```bash
npm run dev
```

Navigate to [http://localhost:4000/](http://localhost:4000/) for GraphQL Playground.

To follow the database, run:
```bash
npx prisma studio
```
