import { useSelector } from "react-redux"

import Header from '../components/Header'
import { IconWarning } from '../assets/svg-icons.jsx';
import './PageNotFound.css';

function PageNotFound() {
	return (
		<>
			<Header />
			<div className="page page-not-found">
				<span className="icon">
					<IconWarning />
				</span>
				<h2>404 - Page Not Found</h2>
				<p className="message">The page you are looking for does not exist.</p>
			</div>
		</>
	)
}

export default PageNotFound
