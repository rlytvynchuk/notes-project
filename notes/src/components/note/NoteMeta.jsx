function NoteMeta({ note}) {
	const dateCreated = note.dateCreated ?
		new Date(parseInt(note.dateCreated)).toLocaleString() : null;
	const dateUpdated = note.dateUpdated ?
		new Date(parseInt(note.dateUpdated)).toLocaleString() : null;
	const isDraft = !note.dateCreated;

	return (
		<div className="note-meta">
			{dateCreated && <p className="meta note-date">Created: {dateCreated}</p>}
			{dateUpdated && <p className="meta note-date">Updated: {dateUpdated}</p>}
			{isDraft && <p className="meta note-draft">Draft</p>}
		</div>
	)
}

export default NoteMeta;