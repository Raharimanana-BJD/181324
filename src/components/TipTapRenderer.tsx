import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TipTapRenderer = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

export default TipTapRenderer;
