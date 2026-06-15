# Notes Backend

Simple Node.js + Express backend for the notes app. Data is stored in `data/db.json`.

## Run

```bash
cd backend
npm install
npm start
```

The server runs on `http://localhost:3001` by default.

## Auth

Signup:

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Ada",
  "email": "ada@example.com",
  "password": "secret123"
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ada@example.com",
  "password": "secret123"
}
```

Both routes return:

```json
{
  "user": {
    "id": "string",
    "name": "Ada",
    "email": "ada@example.com"
  },
  "token": "string"
}
```

Use the token for note requests:

```http
Authorization: Bearer your-token-here
```

## Notes

Each note returned by the API has this shape:

```json
{
  "id": "string",
  "content": "string",
  "dateCreated": 1710000000000,
  "dateUpdated": 1710000000000,
  "isFavorite": false,
  "title": "string"
}
```

Routes:

- `GET /api/notes` - list current user's notes
- `GET /api/notes/:id` - get one note
- `POST /api/notes` - create a note
- `PUT /api/notes/:id` - update a note
- `DELETE /api/notes/:id` - delete a note
- `POST /api/auth/logout` - remove the current auth token
- `GET /api/me` - get the current user
