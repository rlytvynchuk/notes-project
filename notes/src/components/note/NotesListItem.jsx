import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { openNote } from '../../store/notesSlice';
import { extractTextFromBlockNote } from '../../utils/blockNoteUtils';
import NoteMeta from "./NoteMeta";
import './NoteMeta.css';
import './NotesListItem.css';
import { IconFavoriteUnchecked, IconFavoriteChecked } from '../../assets/svg-icons.jsx';
import { updateNote } from '../../store/notesSlice';


function NotesListItem({ note }) {
	const currentNoteId = useSelector(state => state.notes.openedNoteId);
	const isCurrentNote = String(currentNoteId) === String(note.id);
	const currentNoteClass = `note ${isCurrentNote ? 'active' : ''}`;
	const noteTextContent = extractTextFromBlockNote(note.content);

	const dispatch = useDispatch();

	const handleNoteClick = (noteId) => {
		dispatch(openNote(noteId));
	}

	const handleToggleNoteIsFavorite = (e) => {
		e.stopPropagation();
		dispatch(updateNote({
			id: note.id,
			isFavorite: !note.isFavorite
		}));
	}

	return (
		<div className={currentNoteClass} onClick={() => handleNoteClick(note.id)}>
			<div className="data">
				<h3 className="note-title">{note.title}</h3>
				<p className="note-content">{noteTextContent}</p>
				<NoteMeta note={note} />
			</div>
			<div className="favorite-indicator" onClick={(e) => handleToggleNoteIsFavorite(e)}>
				{note.isFavorite ? <IconFavoriteChecked /> : <IconFavoriteUnchecked />}
			</div>
		</div>
	)
}

export default NotesListItem;