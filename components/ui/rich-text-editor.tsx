"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Type
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt("URL do link:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/30 p-2 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded-md hover:bg-secondary transition-colors",
          editor.isActive("bold") && "bg-secondary text-primary"
        )}
        title="Negrito"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded-md hover:bg-secondary transition-colors",
          editor.isActive("italic") && "bg-secondary text-primary"
        )}
        title="Itálico"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "p-2 rounded-md hover:bg-secondary transition-colors",
          editor.isActive("underline") && "bg-secondary text-primary"
        )}
        title="Sublinhado"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>
      
      <div className="w-[1px] h-4 bg-border mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-2 rounded-md hover:bg-secondary transition-colors",
          editor.isActive("bulletList") && "bg-secondary text-primary"
        )}
        title="Lista com marcadores"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-2 rounded-md hover:bg-secondary transition-colors",
          editor.isActive("orderedList") && "bg-secondary text-primary"
        )}
        title="Lista numerada"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "p-2 rounded-md hover:bg-secondary transition-colors",
          editor.isActive("blockquote") && "bg-secondary text-primary"
        )}
        title="Citação"
      >
        <Quote className="h-4 w-4" />
      </button>

      <div className="w-[1px] h-4 bg-border mx-1" />

      <button
        type="button"
        onClick={addLink}
        className={cn(
          "p-2 rounded-md hover:bg-secondary transition-colors",
          editor.isActive("link") && "bg-secondary text-primary"
        )}
        title="Adicionar link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-30"
        title="Desfazer"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-30"
        title="Refazer"
      >
        <Redo className="h-4 w-4" />
      </button>
    </div>
  )
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Escreva a descrição do produto aqui...",
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-sm text-foreground",
          className
        ),
      },
    },
  })

  return (
    <div className="w-full rounded-lg border border-border bg-background focus-within:ring-1 focus-within:ring-primary transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
