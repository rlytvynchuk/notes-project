import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect
} from "react";

import { useTheme } from "../../utils/context/useTheme";

import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

const BlockNoteEditor = forwardRef(({ initialContent, handleChange }, ref) => {

	const { theme } = useTheme();
  const [content, setContent] = useState(initialContent || "");

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? JSON.parse(initialContent)
      : undefined,
  });

  useEffect(() => {
    setContent(initialContent || "");
  }, [initialContent]);

  useEffect(() => {
    if (!editor) return;

    const updateContent = () => {
      try {
        setContent(JSON.stringify(editor.document));
      } catch (error) {
        console.error("Error serializing editor content:", error);
      }
    };

    return editor.onChange(updateContent);

  }, [editor]);

	useEditorChange((editor) => {
    // Log the entire document on every change
		console.log("Content changed:", editor.document);
    handleChange(JSON.stringify(editor.document));
  }, editor);

  useImperativeHandle(ref, () => ({
    editor,
    getContent: () => content,
  }));

  return <BlockNoteView editor={editor} theme={theme}/>;
});

BlockNoteEditor.displayName = "BlockNoteEditor";

export default BlockNoteEditor;