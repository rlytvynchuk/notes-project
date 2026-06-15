import NotesListItem from './note/NotesListItem';
import './NotesList.css';

function NotesList({ notes }) {
	const notesIds = Object.keys(notes).reverse();
	const notesExist = notesIds.length !== 0;

	return (
		<div className={notesExist ? "notes-list" : "notes-list empty"}>
			{!notesExist && <p>No notes to display.</p>}

			{notesExist && notesIds.map(noteId => {
				if (noteId.startsWith('temp-')) {
					return null;
				}
				return (
					<NotesListItem key={noteId} note={notes[noteId]} />
				);
			})}
		</div>
	)
}

export default NotesList;