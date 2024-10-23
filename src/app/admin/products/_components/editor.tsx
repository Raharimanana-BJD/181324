"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EditorContent,
  JSONContent,
  useEditor,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  StrikethroughIcon,
} from "lucide-react";

export const Menubar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              variant={editor.isActive("bold") ? "default" : "secondary"}
              type="button"
              className="font-bold"
            >
              <Bold />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control + B</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              variant={editor.isActive("blockquote") ? "default" : "secondary"}
              type="button"
              className="text-lg"
            >
              <Quote />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control + shift + B</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              variant={editor.isActive("italic") ? "default" : "secondary"}
              type="button"
              className="italic"
            >
              <Italic />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control + I</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              variant={editor.isActive("strike") ? "default" : "secondary"}
              type="button"
              className="line-through"
            >
              <StrikethroughIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control + Shift + S</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              variant={editor.isActive("bulletList") ? "default" : "secondary"}
              type="button"
              className="line-through"
            >
              <List />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control + Shift + 8</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              variant={editor.isActive("orderlist") ? "default" : "secondary"}
              type="button"
              className="line-through"
            >
              <ListOrdered />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Control + Shift + 7</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const TipTapEditor = ({
  json,
  setJson,
}: {
  setJson: any;
  json: JSONContent | null;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: json,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] prose prose-sm sm:prose-base",
      },
    },
    onUpdate: ({ editor }) => {
      setJson(editor.getJSON());
    },
  });
  return (
    <div>
      <Menubar editor={editor} />
      <EditorContent
        editor={editor}
        className="rounded-lg border p-4 min-h-[150px] mt-2"
      />
    </div>
  );
};
function setJson(arg0: JSONContent) {
  throw new Error("Function not implemented.");
}
