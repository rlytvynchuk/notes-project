import './Spinner.css';

function Spinner() {
	return (
		<div className="spinner-container">
			<svg className="loading-spinner" viewBox="0 0 50 50">
				<circle className="loading-spinner" cx="25" cy="25" r="20"></circle>
			</svg>
			<span className="loading-text">Loading...</span>
		</div>
	);
}

export default Spinner;