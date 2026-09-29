"use client";

import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type ToolbarButton = {
  label: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  title?: string;
};

export function RichEditor({
  initialContent,
  placeholder,
  onChange,
}: {
  initialContent?: string;
  placeholder?: string;
  onChange: (html: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "Введите текст…" }),
    ],
    content: initialContent || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      h2: editor?.isActive("heading", { level: 2 }) ?? false,
      h3: editor?.isActive("heading", { level: 3 }) ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      link: editor?.isActive("link") ?? false,
    }),
  });

  if (!editor) {
    return (
      <div className="min-h-[12rem] rounded-md border border-zinc-300 bg-zinc-50" />
    );
  }

  async function handleImage(file: File | null) {
    if (!file || !editor) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/admin/api/upload", { method: "POST", body: form });
    const data = (await res.json()) as { url?: string; error?: string };
    if (res.ok && data.url) {
      editor.chain().focus().setImage({ src: data.url }).run();
    } else {
      alert(data.error || "Не удалось загрузить картинку");
    }
  }

  function addLink() {
    if (!editor) return;
    const url = prompt("Ссылка (https://…):");
    if (!url) return;
    const normalized = /^https?:\/\//.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: normalized }).run();
  }

  const buttons: ToolbarButton[] = [
    {
      label: <Bold size={16} aria-hidden="true" />,
      title: "Жирный",
      active: editorState?.bold ?? false,
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: <Italic size={16} aria-hidden="true" />,
      title: "Курсив",
      active: editorState?.italic ?? false,
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: <Heading2 size={16} aria-hidden="true" />,
      title: "Заголовок H2",
      active: editorState?.h2 ?? false,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: <Heading3 size={16} aria-hidden="true" />,
      title: "Заголовок H3",
      active: editorState?.h3 ?? false,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: <List size={16} aria-hidden="true" />,
      title: "Маркированный список",
      active: editorState?.bulletList ?? false,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: <ListOrdered size={16} aria-hidden="true" />,
      title: "Нумерованный список",
      active: editorState?.orderedList ?? false,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: <Link2 size={16} aria-hidden="true" />,
      title: "Добавить ссылку",
      active: editorState?.link ?? false,
      onClick: addLink,
    },
    {
      label: <ImageIcon size={16} aria-hidden="true" />,
      title: "Вставить картинку",
      onClick: () => fileRef.current?.click(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-md border border-zinc-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 px-2 py-1.5">
        {/* eslint-disable-next-line react-hooks/refs -- обработчики кнопок читают editor в событиях, не в рендере */}
        {buttons.map((b) => (
          <Button
            key={b.title}
            type="button"
            variant="ghost"
            size="icon-sm"
            title={b.title}
            onClick={b.onClick}
            className={cn(
              "text-zinc-700",
              b.active && "bg-brand-100 text-brand-800 hover:bg-brand-100"
            )}
          >
            {b.label}
          </Button>
        ))}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
        />
      </div>
      <EditorContent
        editor={editor}
        className="px-4 py-3 text-sm leading-relaxed text-zinc-800"
      />
    </div>
  );
}