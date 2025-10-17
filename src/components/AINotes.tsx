import React, { useState, useEffect } from "react";
import { X, Mic, Save, Trash2, Bot, Sparkles, Loader } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface AINotesProps {
  isOpen: boolean;
  onClose: () => void;
}

const AINotes: React.FC<AINotesProps> = ({ isOpen, onClose }) => {
  const [currentNote, setCurrentNote] = useState<{
    id: string;
    title: string;
    content: string;
    tags: string[];
  } | null>(null);
  const [noteList, setNoteList] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content:
      "<p>Start writing your note or use the microphone to transcribe...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-invert focus:outline-none max-w-full h-full p-4",
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      // TODO: Fetch notes from Firebase
      console.log("AI Notes opened. Fetching notes...");
      setNoteList([
        {
          id: "1",
          title: "My First Note",
          content: "<p>This is a sample note.</p>",
          tags: ["sample", "test"],
        },
        {
          id: "2",
          title: "Meeting Ideas",
          content: "<p>Discuss Q4 strategy.</p>",
          tags: ["work", "meeting"],
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentNote) {
      editor?.commands.setContent(currentNote.content);
    } else {
      editor?.commands.setContent("<p>Select a note or create a new one.</p>");
    }
  }, [currentNote, editor]);

  if (!isOpen) {
    return null;
  }

  const handleNewNote = () => {
    const newNote = {
      id: `note_${Date.now()}`,
      title: "New Note",
      content: "<p>Start writing...</p>",
      tags: [],
    };
    setCurrentNote(newNote);
    setNoteList([newNote, ...noteList]);
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="w-[90vw] h-[85vh] max-w-4xl bg-slate-900/70 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold">AI Notes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/4 border-r border-slate-700/50 flex flex-col">
            <div className="p-2">
              <button
                onClick={handleNewNote}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                New Note
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-2">
              {noteList.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg cursor-pointer mb-2 ${
                    currentNote?.id === note.id
                      ? "bg-slate-700"
                      : "hover:bg-slate-800"
                  }`}
                  onClick={() => setCurrentNote(note)}
                >
                  <h3 className="font-semibold truncate">{note.title}</h3>
                  <p
                    className="text-sm text-gray-400 truncate"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-3/4 flex flex-col">
            {currentNote ? (
              <>
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) =>
                      setCurrentNote({ ...currentNote, title: e.target.value })
                    }
                    className="bg-transparent text-2xl font-bold focus:outline-none w-full"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-full hover:bg-slate-700"
                      title="Save Note"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-red-500/20 text-red-400"
                      title="Delete Note"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-grow relative bg-slate-800/50 m-2 rounded-lg">
                  <EditorContent
                    editor={editor}
                    className="h-full overflow-y-auto"
                  />
                </div>
                <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      Summarize
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      Tag
                    </button>
                  </div>
                  <button
                    className={`p-4 rounded-full transition-colors ${
                      isListening
                        ? "bg-red-500 animate-pulse"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                    title={isListening ? "Stop Recording" : "Start Recording"}
                  >
                    <Mic className="w-6 h-6 text-white" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-gray-500">
                <p>Select a note to view or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AINotes;
