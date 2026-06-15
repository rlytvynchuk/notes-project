import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	next();
});

let writeQueue = Promise.resolve();

const readDatabase = async () => {
	const file = await fs.readFile(DATA_FILE, 'utf8');
	const data = JSON.parse(file);

	return {
		users: typeof data.users === 'object' && !Array.isArray(data.users) ? data.users : {},
		notes: typeof data.notes === 'object' && !Array.isArray(data.notes) ? data.notes : {},
		sessions: Array.isArray(data.sessions) ? data.sessions : []
	};
};

const writeDatabase = async (data) => {
	writeQueue = writeQueue.then(() =>
		fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`)
	);

	return writeQueue;
};

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${hash}`;
};

const verifyPassword = (password, passwordHash) => {
	const [salt, storedHash] = passwordHash.split(':');
	const attemptedHash = hashPassword(password, salt).split(':')[1];

	return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(attemptedHash, 'hex'));
};

const createToken = () => crypto.randomBytes(32).toString('hex');

const toPublicUser = (user) => ({
	id: user.id,
	name: user.name,
	email: user.email
});

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const findUserById = (users, userId) => {
	return Object.values(users).find((user) => user.id === userId);
};

const getUserNotes = (db, user) => {
	db.notes[user.email] = db.notes[user.email] || {};
	return db.notes[user.email];
};

const toPublicNote = ({ userId, ...note }) => note;

const createHttpError = (status, message) => {
	const error = new Error(message);
	error.status = status;
	return error;
};

const requireAuth = async (req, res, next) => {
	try {
		const authorization = req.get('authorization') || '';
		const [type, token] = authorization.split(' ');

		if (type !== 'Bearer' || !token) {
			throw createHttpError(401, 'Authorization token is required');
		}

		const db = await readDatabase();
		const session = db.sessions.find((item) => item.token === token);

		if (!session) {
			throw createHttpError(401, 'Invalid or expired token');
		}

		const user = findUserById(db.users, session.userId);

		if (!user) {
			throw createHttpError(401, 'User for this session no longer exists');
		}

		req.user = user;
		req.db = db;
		req.token = token;
		next();
	} catch (error) {
		next(error);
	}
};

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.post('/api/auth/signup', async (req, res, next) => {
	try {
		const name = String(req.body.name || '').trim();
		const email = normalizeEmail(req.body.email);
		const password = String(req.body.password || '');

		if (!name || !email || !password) {
			throw createHttpError(400, 'Name, email, and password are required');
		}

		if (password.length < 6) {
			throw createHttpError(400, 'Password must be at least 6 characters long');
		}

		const db = await readDatabase();
		const userAlreadyExists = email in db.users;

		if (userAlreadyExists) {
			throw createHttpError(409, 'A user with this email already exists');
		}

		const user = {
			id: crypto.randomUUID(),
			name,
			email,
			passwordHash: hashPassword(password),
			dateCreated: Date.now()
		};
		const token = createToken();

		db.users[email] = user;
		db.notes[email] = {};
		db.sessions.push({
			token,
			userId: user.id,
			dateCreated: Date.now()
		});

		await writeDatabase(db);

		res.status(201).json({
			user: toPublicUser(user),
			token
		});
	} catch (error) {
		next(error);
	}
});

app.post('/api/auth/login', async (req, res, next) => {
	try {
		const email = normalizeEmail(req.body.email);
		const password = String(req.body.password || '');

		if (!email || !password) {
			throw createHttpError(400, 'Email and password are required');
		}

		const db = await readDatabase();
		const user = db.users[email];

		if (!user || !verifyPassword(password, user.passwordHash)) {
			throw createHttpError(401, 'Invalid email or password');
		}

		const token = createToken();
		db.sessions.push({
			token,
			userId: user.id,
			dateCreated: Date.now()
		});

		await writeDatabase(db);

		res.json({
			user: toPublicUser(user),
			token
		});
	} catch (error) {
		next(error);
	}
});

app.post('/api/auth/logout', requireAuth, async (req, res, next) => {
	try {
		req.db.sessions = req.db.sessions.filter((session) => session.token !== req.token);
		await writeDatabase(req.db);
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

app.get('/api/me', requireAuth, (req, res) => {
	res.json({ user: toPublicUser(req.user) });
});

app.get('/api/notes', requireAuth, (req, res) => {
	const notes = Object.fromEntries(
		Object.entries(getUserNotes(req.db, req.user)).map(([id, note]) => [id, toPublicNote(note)])
	);

	res.json(notes);
});

app.get('/api/notes/:id', requireAuth, (req, res, next) => {
	try {
		const note = getUserNotes(req.db, req.user)[req.params.id];

		if (!note) {
			throw createHttpError(404, 'Note not found');
		}

		res.json(toPublicNote(note));
	} catch (error) {
		next(error);
	}
});

app.post('/api/notes', requireAuth, async (req, res, next) => {
	try {
		const title = String(req.body.title || '').trim();
		const content = String(req.body.content || '').trim();
		const now = Date.now();

		if (!title && !content) {
			throw createHttpError(400, 'Title or content is required');
		}

		const note = {
			id: crypto.randomUUID(),
			content,
			dateCreated: now,
			dateUpdated: now,
			isFavorite: Boolean(req.body.isFavorite),
			title,
			userId: req.user.id
		};

		getUserNotes(req.db, req.user)[note.id] = note;
		await writeDatabase(req.db);

		res.status(201).json(toPublicNote(note));
	} catch (error) {
		next(error);
	}
});

app.put('/api/notes/:id', requireAuth, async (req, res, next) => {
	try {
		const note = getUserNotes(req.db, req.user)[req.params.id];

		if (!note) {
			throw createHttpError(404, 'Note not found');
		}

		if ('title' in req.body) {
			note.title = String(req.body.title || '').trim();
		}

		if ('content' in req.body) {
			note.content = String(req.body.content || '').trim();
		}

		if ('isFavorite' in req.body) {
			note.isFavorite = Boolean(req.body.isFavorite);
		}

		note.dateUpdated = Date.now();
		await writeDatabase(req.db);

		res.json(toPublicNote(note));
	} catch (error) {
		next(error);
	}
});

app.delete('/api/notes/:id', requireAuth, async (req, res, next) => {
	try {
		const notes = getUserNotes(req.db, req.user);

		if (!notes[req.params.id]) {
			throw createHttpError(404, 'Note not found');
		}

		delete notes[req.params.id];
		await writeDatabase(req.db);
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
	console.error(error);

	const status = error.status || 500;
	const message = status === 500 ? 'Something went wrong' : error.message;

	res.status(status).json({ error: message });
});

app.listen(PORT, () => {
	console.log(`Notes backend is running on http://localhost:${PORT}`);
});
