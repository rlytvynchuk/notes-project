import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "../utils/context/useTheme";
import { createDraftNote } from '../store/notesSlice';
import { NavLink, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";

import { IconThemeLight, IconThemeDark } from '../assets/svg-icons.jsx';
import './Header.css';

function Header() {
	const dispatch = useDispatch();
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();

	const loggedInUser = useSelector(state => state.user.loggedInUser);

	const handleAddNote = () => {
		navigate('/');
		dispatch(createDraftNote());
	}

	return (
		<header className="header">
			<h1>Notes</h1>
			
			<div className="tabs">
				{loggedInUser &&
				<>
					<NavLink to="/" end
						className={({ isActive }) => isActive ? "tab active" : "tab" }
					>
						All Notes
					</NavLink>
					<NavLink
						to="/favorites"
						className={({ isActive }) => isActive ? "tab active" : "tab" }
					>
						Favorites
					</NavLink>
				</>
				}
			</div>
			
			<div className="header-buttons">
				<UserMenu loggedInUser={loggedInUser} />
				{loggedInUser && (
					<button className="new-note-btn accent" onClick={handleAddNote}>
						New Note
					</button>
				)}
				<button className="theme-toggle-btn" onClick={toggleTheme}>
					{theme === "light" ? <IconThemeLight /> : <IconThemeDark />}
				</button>
			</div>
		</header>
	)
}

export default Header;