import { configureStore } from '@reduxjs/toolkit'
import notesReducer from './notesSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    notes: notesReducer,
		user:  userReducer
  }
})