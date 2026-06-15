import { useSelector, useDispatch } from "react-redux"
import { useEffect } from 'react';
import { getNotes } from './store/notesSlice.js';

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage'
import PageNotFound from './pages/PageNotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExcercisePage from './pages/ExcercisePage';

import './App.css'
import './common.css';

const router = createBrowserRouter([
	{
		path: "/",
		element:
			<ProtectedRoute>
				<HomePage onlyFavorites={false} />
			</ProtectedRoute>,
	},
	{
		path: "/favorites",
		element:
			<ProtectedRoute>
				<HomePage onlyFavorites={true} />
			</ProtectedRoute>,
	},
	{
		path: "*",
		element: <PageNotFound />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/signup",
		element: <SignupPage />,
	},
	{
		path: "/exercise",
		element: <ExcercisePage />,
	}
]);

function App() {
	const dispatch = useDispatch();
	const authToken = useSelector(state => state.user.authToken) || null;

	useEffect(() => {
		const fetchNotes = async () => {
			console.log('fetching notes');
			await dispatch(getNotes());
		}

		if (authToken)
			fetchNotes();
	}, [dispatch, authToken]);

	return (
		<RouterProvider router={router} />
	);
}

export default App
