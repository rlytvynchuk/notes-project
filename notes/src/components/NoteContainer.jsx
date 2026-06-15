import { useDispatch, useSelector } from "react-redux"
import { createDraftNote } from '../store/notesSlice';
import EditNote from "./note/EditNote";

import './NoteContainer.css';

function NoteContainer({ openedNote }) {
	const dispatch = useDispatch();
	const notes = useSelector(state => state.notes.notesList);
	const noNotes = Object.keys(notes).length === 0;

	const handleAddNote = () => {
		dispatch(createDraftNote());
	}

	const containerClass = `note-container ${!openedNote ? 'empty' : ''}`;

	return (
		<div className={containerClass}>
			{!openedNote && (
				<>
					<div className="empty-message">
						{`Please ${noNotes ? '' : 'select or '} create a new note.`}
					</div>
					<div className="buttons">
						<button className="new-note-btn" onClick={handleAddNote}>
							New Note
						</button>
					</div>
				</>
			)}

			{openedNote && <EditNote note={openedNote} />}
		</div>
	)
}

export default NoteContainer;