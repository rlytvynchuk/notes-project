function ErrorsList({ errors }) {
	if (!errors || Object.keys(errors).length === 0) return null;

	return (
		<ul className="errors-list">
			{Object.entries(errors).map(([field, error]) => (
				<li key={field}>{error}</li>
			))}
		</ul>
	);
}

export default ErrorsList;