import React, { useState, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';

const Child = React.memo(({ onClick }) => {
		console.log("Child rendered");
		return (
			<button onClick={onClick}>
				Add Note
			</button>
		);
	});

function ExcercisePage() {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 1000); // Debounces search input
	
	const [count, setCount] = useState(0);
	const [notes, setNotes] = useState([
		"Learn React",
		"Learn Redux",
		"Buy milk",
		"Workout",
		"Learn Next.js",
	]);
	

	const filteredNotes = useMemo(() => {
		console.log("Filtering notes...");
		return notes.filter(note =>
			note.toLowerCase().includes(debouncedSearch.toLowerCase())
		);
	}, [debouncedSearch, notes]);

	const addNote = React.useCallback(() => {
  	setNotes(prev => [...prev, `New Note ${Date.now()}`]);
	}, []);

	return (
		<>
			<input
				value={search}
				onChange={e => setSearch(e.target.value)}
			/>

			<button onClick={() => setCount(c => c + 1)}>
				Counter: {count}
			</button>

			<ul>
				{filteredNotes.map(note => (
					<li key={note}>{note}</li>
				))}
			</ul>

			<Child onClick={addNote} />
		</>
	);
}

export default ExcercisePage;