import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import "../styles/rich-text-editor.css"

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

const ToolbarButton = ({ onClick, active, title, children }: ToolbarButtonProps) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault()
      onClick()
    }}
    className={[
      "flex items-center justify-center w-7 h-7 rounded text-sm font-medium transition-colors",
      active
        ? "bg-ui-bg-base-pressed text-ui-fg-base"
        : "text-ui-fg-subtle hover:bg-ui-bg-base-hover hover:text-ui-fg-base",
    ].join(" ")}
  >
    {children}
  </button>
)

const RichTextEditor = ({ value, onChange, placeholder }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external value changes (e.g. after initial data fetch)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  }, [value])

  if (!editor) return null

  return (
    <div className="rich-text-editor rounded-md border border-ui-border-base bg-ui-bg-field shadow-borders-base focus-within:shadow-borders-interactive-with-active">
      <div className="flex flex-wrap gap-0.5 border-b border-ui-border-base px-2 py-1.5">
        <ToolbarButton
          title="Gras"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italique"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <em>I</em>
        </ToolbarButton>
        <div className="w-px bg-ui-border-base mx-1 self-stretch" />
        <ToolbarButton
          title="Titre"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Sous-titre"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>
        <div className="w-px bg-ui-border-base mx-1 self-stretch" />
        <ToolbarButton
          title="Liste à puces"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          •—
        </ToolbarButton>
        <ToolbarButton
          title="Liste numérotée"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1—
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
