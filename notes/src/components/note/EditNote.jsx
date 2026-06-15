import { useDebounce } from '../../hooks/useDebounce';
import { useDispatch } from "react-redux"
import { createNote, updateNote, deleteNote } from '../../store/notesSlice';
import { useState, useRef, useEffect } from "react";
import BlockNoteEditor from '../blocknote/BlocknoteEditor';
import NoteMeta from "./NoteMeta";

import './EditNote.css';
import { IconDelete, IconFavoriteUnchecked, IconFavoriteChecked } from '../../assets/svg-icons.jsx';

function EditNote({ note }) {
	const dispatch = useDispatch();
	const blockNoteRef = useRef(null);
	const isFirstRender = useRef(true);
	const isSyncingFromNote = useRef(false);
	const isFirstSave = useRef(!note.dateCreated);
	const isDraft = !note.dateCreated;

	const [formData, setFormData] = useState({
		title: note.title,
		content: note.content,
		isFavorite: note.isFavorite
	});

	const [isFavorite, setIsFavorite] = useState(note.isFavorite);

	const debouncedFormData = useDebounce(formData, 2000);
	//const debouncedIsFavorite = useDebounce(isFavorite, 300);

	useEffect(() => {
		isSyncingFromNote.current = true;

		setFormData({
			title: note.title,
			content: note.content,
		});
	}, [note.id]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (isSyncingFromNote.current) {
			isSyncingFromNote.current = false;
			return;
		}

		if (
			debouncedFormData.title === note.title &&
			JSON.stringify(debouncedFormData.content) === JSON.stringify(note.content)
		) {
			return;
		}

		if (!debouncedFormData || !debouncedFormData.title || !debouncedFormData.content)
			return;

		if (isFirstSave.current) {
			isFirstSave.current = false;
			dispatch(createNote({
				title: debouncedFormData.title,
				content: debouncedFormData.content,
				isFavorite: isFavorite
			}));
		} else {
			dispatch(updateNote({
				id: note.id,
				title: debouncedFormData.title,
				content: debouncedFormData.content,
				isFavorite: isFavorite
			}));
		}



	}, [debouncedFormData, dispatch, note.id, note.isFavorite]);

	const handleDeleteNote = () => {
		dispatch(deleteNote(note.id));
	}

	const handleToggleNoteIsFavorite = () => {
		setIsFavorite(prev => !prev);
		dispatch(updateNote({
			id: note.id,
			isFavorite: !isFavorite
		}));
	}

	const handleTitleChange = (e) => {
		setFormData(prev => ({
			...prev,
			title: e.target.value
		}));
	}

	const handleContentChange = (content) => {
		setFormData(prev => ({
			...prev,
			content
		}));
	}

	return (
		<div className="edit-note">
			<div className="panel">
				{!isDraft && (
					<span className="toolbar">
						<button className="favorite-note-btn"
							title="Favorite Note"
							onClick={handleToggleNoteIsFavorite}
						>
							{note.isFavorite ?
								<IconFavoriteChecked /> : <IconFavoriteUnchecked />}
							Favorite
						</button>
						<button className="delete-note-btn danger"
							title="Delete Note"
							onClick={handleDeleteNote}
						>
							<IconDelete />
							Delete Note
						</button>
					</span>)}
				<NoteMeta note={note} />
			</div>
			<div className="note-title">
				<input type="text"
					placeholder="Note Title"
					value={formData.title}
					onChange={handleTitleChange}
				/>
			</div>
			<BlockNoteEditor key={note.id}
				ref={blockNoteRef}
				initialContent={note.content}
				handleChange={handleContentChange}
			/>
		</div>
	)
}

export default EditNote;