import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api.js';

const storeUserInLocalStorage = (user, token) => {
	localStorage.setItem('user', JSON.stringify(user));
	localStorage.setItem('authToken', token);
}

const removeUserFromLocalStorage = () => {
	localStorage.removeItem('user');
	localStorage.removeItem('authToken');
}

const getInitialUserState = () => {
	const savedUser = localStorage.getItem('user')
	const authToken = localStorage.getItem('authToken')

	return {
		loggedInUser: savedUser ? JSON.parse(savedUser) : null,
		authToken: authToken ? authToken : null
	}
}

const userSlice = createSlice({
	name: 'user',
	initialState: getInitialUserState(),
	reducers: {
		setUser: (state, action) => {
			state.loggedInUser = action.payload;
			storeUserInLocalStorage(action.payload, state.authToken);
		},
	},
	extraReducers: (builder) => {

		// sing up user
		builder.addCase(signUpUser.fulfilled, (state, action) => {
			// server returns { user, token }
			state.loggedInUser = action.payload.user;
			state.authToken = action.payload.token;
			storeUserInLocalStorage(action.payload.user, action.payload.token);
			return state;
		}).addCase(signUpUser.rejected, (state, action) => {
			console.error('Sign-up failed:', action.error);
		});

		// login user
		builder.addCase(logInUser.fulfilled, (state, action) => {
			// server returns { user, token }
			state.loggedInUser = action.payload.user;
			state.authToken = action.payload.token;
			storeUserInLocalStorage(action.payload.user, action.payload.token);
			return state;
		}).addCase(logInUser.rejected, (state, action) => {
			console.error('Sign-in failed:', action.error);
			return action.payload;
		});

		// logout user
		builder.addCase(logOutUser.fulfilled, (state) => {
			// server returns { user, token }
			state.loggedInUser = null;
			state.authToken = null;
			removeUserFromLocalStorage();
			return state;
		}).addCase(logOutUser.rejected, (state, action) => {
			console.error('Logout failed:', action.error);
			state.loggedInUser = null;
			state.authToken = null;
			removeUserFromLocalStorage();
		});

	}
})

export const signUpUser = createAsyncThunk(
	'user/signUpUser',
	async (userData) => {
		const response = await api.post('/api/auth/signup', userData);
		return response.data;
	});

export const logInUser = createAsyncThunk(
  'user/logInUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const logOutUser = createAsyncThunk(
	'user/logOutUser',
	async () => {
		await api.post('/api/auth/logout');
	}
);

export const {
	setUser,
} = userSlice.actions

export default userSlice.reducer