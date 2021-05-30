# mdvsh.co

> or, shawrty

A dead simple URL shortener web app. Running [here](https://mdvsh.co/shawrty).

 I adapted the styles of Exun's old link shortener ([exun.co](https://github.com/exunclan/exun.co)) for the user dashboard and the *.authorized* file to enable multi-user access to the app.
 
 This project is written in TypeScript using Express, EJS and Prisma.

---

## Setup

1. Clone the repo and install dependencies.

```sh
git clone https://github.com/pseudocodenerd/mdvsh.co
cd mdvsh.co
npm install
```

2. Rename `.env.sample` to `.env` and fill appropriately.

3. Create a `.authorized` filed with emails of users allowed to access the web-app on new lines.

4. Obtaining Google Cloud Credentials for OAuth.
   - Add an API to your google developer's console (preferably `Google+ API`).
   - Configure an OAuth consent screen with the correct details.
   - Create a client id with correct Authorised Redirect URIs, here:
     - `http://localhost:3000/shawrty/auth` (dev)
     - `https://<your-domain>.com/shawrty/auth` (production)
    - Download the `client_secret.json` file from your console and place it in the root of the directory.

5. Run the following command to instantiate the PrismaClient.

```sh
npx prisma generate
```

6. . . and you're done.

```sh
npm run start
$ > mdvsh.co@1.0.0 dev 
$ > ts-node src/app.ts
$ 🚀 Server ready at: http://localhost:3000
```

---
