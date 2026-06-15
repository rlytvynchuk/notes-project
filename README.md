# Info
That's the pet project that allows you to create/update/delete notes and mark/filter favorites. Has basic Auth implemented

- Backend is AI coded (Copilot CLI)
- Front-end is hand made

# Notes Backend

Simple Node.js + Express backend for the notes app. Data is stored in `data/db.json`.

## Run

```bash
cd backend
npm install
npm start
```

The server runs on `http://localhost:3001` by default.

# Notes Frontend

Simple React + Redux front-end for the notes app.

**Stack**
- React (19.2.6)
- React Router Dom (7.16)
- Redux (5.0.1)
- BlockNote Editor (https://www.blocknotejs.org)

## Run

```bash
cd backend
npm install
npm run dev
```

The client runs on `http://localhost:5173` by default.

