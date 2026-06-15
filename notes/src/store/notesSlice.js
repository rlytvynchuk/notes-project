import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api.js';

const getInitialNotesState = () => {
	return {
		notesList: {},
		openedNoteId: null,
	}
}

const notesSlice = createSlice({
	name: 'notes',
	initialState: getInitialNotesState(),
	reducers: {
		createDraftNote: (state) => {
			const newNote = {
				id: `temp-${crypto.randomUUID()}`,
				title: '',
				content: '',
				dateCreated: null,
				dateUpdated: null,
				isFavorite: false
			}
			state.notesList[newNote.id] = newNote;
			state.openedNoteId = newNote.id;
		},
		openNote: (state, action) => {
			state.openedNoteId = action.payload;
		},
	},
	extraReducers: (builder) => {
	
			// fetch notes for user
			builder.addCase(getNotes.fulfilled, (state, action) => {
				// server returns { user, token }
				state.notesList = action.payload;
				return state;
			}).addCase(getNotes.rejected, (state, action) => {
				console.error('Failed to fetch notes:', action.error);
			});

			// update note for user
			builder.addCase(updateNote.fulfilled, (state, action) => {
				state.notesList[action.payload.id] = action.payload;
				return state;
			}).addCase(updateNote.rejected, (state, action) => {
				console.error(`Failed to update note ${action.meta.arg.id}`, action.error);
			});

			// create note for user
			builder.addCase(createNote.fulfilled, (state, action) => {
				state.notesList[action.payload.id] = action.payload;
				state.openedNoteId = action.payload.id;
				return state;
			}).addCase(createNote.rejected, (state, action) => {
				console.error(`Failed to create note`, action.error);
			});

			// delete note for user
			builder.addCase(deleteNote.fulfilled, (state, action) => {
				const noteId = action.meta.arg;
				delete state.notesList[noteId];
				if (state.openedNoteId === noteId) {
					state.openedNoteId = null;
				}
				return state;
			}).addCase(deleteNote.rejected, (state, action) => {
				console.error(`Failed to create note`, action.error);
			});
		}
})

export const getNotes = createAsyncThunk(
	'notes/getNotes',
	async () => {
		const response = await api.get('/api/notes');
		return response.data;
	});

export const createNote = createAsyncThunk(
	'notes/createNote',
	async (noteData) => {
		const response = await api.post('/api/notes', {
			title: noteData.title,
			content: noteData.content,
			isFavorite: noteData.isFavorite
		});
		return response.data;
	});

export const updateNote = createAsyncThunk(
	'notes/updateNote',
	async (noteData) => {
		const response = await api.put(`/api/notes/${noteData.id}`, noteData);
		return response.data;
	});

export const deleteNote = createAsyncThunk(
	'notes/deleteNote',
	async (noteId) => {
		const response = await api.delete(`/api/notes/${noteId}`);
		return response.data;
	});

export const {
	openNote,
	createDraftNote
} = notesSlice.actions
export default notesSlice.reducer
