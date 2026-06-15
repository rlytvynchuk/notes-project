// Helper function to extract plain text from BlockNote serialized content
export const extractTextFromBlockNote = (serializedContent) => {
	try {
		const blocks = serializedContent === "" ?
			serializedContent : JSON.parse(serializedContent);
		
		// Handle both array format and object with blocks property
		const blockArray = Array.isArray(blocks) ? blocks : (blocks.blocks || []);
		
		if (!Array.isArray(blockArray)) {
			return '';
		}

		const extractBlockText = (block) => {
			let text = '';
			
			// Extract text from content array
			if (block.content && Array.isArray(block.content)) {
				text = block.content
					.filter(item => item.type === 'text')
					.map(item => item.text || '')
					.join('');
			}
			
			// Recursively extract from children
			if (block.children && Array.isArray(block.children)) {
				const childrenText = block.children
					.map(extractBlockText)
					.filter(t => t.length > 0)
					.join(' ');
				if (childrenText) {
					text = text ? text + ' ' + childrenText : childrenText;
				}
			}
			
			return text.trim();
		};

		return blockArray
			.map(extractBlockText)
			.filter(text => text.length > 0)
			.join(' ');
	} catch (error) {
		console.error('Error parsing note content:', error);
		return '';
	}
};