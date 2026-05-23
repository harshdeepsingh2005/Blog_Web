import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Code, Image as ImageIcon, Link as LinkIcon, Minus } from 'lucide-react';
import '../styles/editor.css';

const MenuBar = ({ editor, onImageUpload }) => {
  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    // cancelled
    if (url === null) return;
    
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = async () => {
    // If a custom uploader is provided (e.g. for our backend /api/uploads)
    if (onImageUpload) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        if (e.target.files?.length) {
          const file = e.target.files[0];
          const url = await onImageUpload(file);
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }
      };
      input.click();
    } else {
      // Fallback to URL prompt
      const url = window.prompt('Image URL');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const MenuButton = ({ onClick, isActive, disabled, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 border-2 border-transparent text-text-primary dark:text-white transition-colors ${
        isActive ? 'bg-text-primary text-white dark:bg-white dark:text-black border-text-primary dark:border-white' : 'hover:border-text-primary dark:hover:border-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b-4 border-text-primary dark:border-white bg-muted dark:bg-[#111]">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <Bold size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <Italic size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
      >
        <Code size={16} />
      </MenuButton>
      
      <div className="w-1 h-6 bg-text-primary dark:bg-white mx-2" />
      
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        <List size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        <ListOrdered size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <Quote size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </MenuButton>

      <div className="w-1 h-6 bg-text-primary dark:bg-white mx-2" />

      <MenuButton
        onClick={addLink}
        isActive={editor.isActive('link')}
      >
        <LinkIcon size={16} />
      </MenuButton>
      <MenuButton onClick={addImage}>
        <ImageIcon size={16} />
      </MenuButton>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, onImageUpload, placeholder = 'Start writing...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-none border-4 border-text-primary dark:border-white max-w-full h-auto object-cover my-8',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent underline underline-offset-2 hover:text-accent-hover cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-editorial p-4 min-h-[300px] focus:outline-none w-full max-w-none',
      },
    },
  });

  return (
    <div className="border-4 border-text-primary dark:border-white rounded-none bg-surface dark:bg-surface-dark focus-within:border-accent transition-colors overflow-hidden">
      <MenuBar editor={editor} onImageUpload={onImageUpload} />
      <EditorContent editor={editor} />
      {editor && (
        <div className="text-xs font-bold uppercase tracking-widest text-text-primary dark:text-white p-3 border-t-4 border-text-primary dark:border-white bg-muted dark:bg-[#111] text-right">
          {editor.storage.characterCount?.words() || editor.getText().trim().split(/\s+/).filter(Boolean).length} WORDS
        </div>
      )}
    </div>
  );
}
