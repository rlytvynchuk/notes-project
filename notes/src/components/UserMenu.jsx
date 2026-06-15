//import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOutUser } from '../store/userSlice.js';

import { IconUser, IconLogin } from '../assets/svg-icons';
import './UserMenu.css';


function UserMenu({ loggedInUser }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	//const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = async (event) => {
		event.preventDefault();
		try {
			await dispatch(logOutUser()).unwrap();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	return (
		<>
			{loggedInUser ? (
				<div className="user-menu logged-in">
					<span className="icon">
						<IconUser />
					</span>
					<span className="user-name">
						{loggedInUser.name}
						<a href="/login" onClick={handleLogout}>(Log Out)</a>
					</span>
				</div>
			) : (
				<NavLink to="/login" className="user-menu guest">
					<span className="icon">
						<IconLogin />
					</span>
					<span className="user-name">Login</span>
				</NavLink>
			)}

		</>
	)
}

export default UserMenu;