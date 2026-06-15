import { useSelector } from "react-redux"

import Header from '../components/Header'
import NotesList from '../components/NotesList'
import NoteContainer from '../components/NoteContainer'

function HomePage({onlyFavorites}) {
	//console.log('HomePage rendered');
	
	const allNotes = useSelector(state => state.notes.notesList);
	const notes = onlyFavorites ?
			Object.fromEntries(
				Object.entries(allNotes).filter( ([id, note]) => note.isFavorite )
      )
    : allNotes;

	const openedNoteId = useSelector(state => state.notes.openedNoteId);
	const openedNote = notes[openedNoteId];

	return (
		<>
			<Header />
			<NotesList notes={notes} />
			<NoteContainer openedNote={openedNote} />
		</>
	)
}

export default HomePage
