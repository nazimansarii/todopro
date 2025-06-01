import React, { useContext, useState, useEffect } from "react";
import { Input } from "./Input";
import { ThemeContext } from "../context/ThemeContext";
import { db, auth } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import TaskSkeleton from "./TaskSkeleton";
import useFilter from "../hooks/useFilter";
import Modal from "./Modal";

const Notes = () => {
  const [isDark] = useContext(ThemeContext);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // For editing
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [addNote, setAddNote] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState({
    title: "",
    content: "",
  });

  const [filetedData, setQuery] = useFilter(notes, (note) => note.title);

  // For adding a new note
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setAddNote((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  // Fetch notes from Firestore for the current user
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(
        snapshot.docs
          .filter((doc) => doc.data().uid === user.uid)
          .map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Add note to Firestore
  const handleAddNote = async () => {
    // Check for duplicate title
    const duplicate = notes.some(
      (note) =>
        note.title.trim().toLowerCase() === addNote.title.trim().toLowerCase()
    );
    if (duplicate) {
      setError({ title: "Note with this title already exists." });
      return;
    }
    if (!addNote.title) {
      setError((prev) => ({
        ...prev,
        title: "Title is required.",
      }));
      return;
    }
    if (!addNote.content) {
      setError((prev) => ({
        ...prev,
        content: "Content is required.",
      }));
      return;
    }

    if (!user) return;
    if (!addNote.title.trim() || !addNote.content.trim()) return;

    setMessage("Note Added successfully.");
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      setMessage("");
    }, 2000);
    await addDoc(collection(db, "notes"), {
      title: addNote.title,
      content: addNote.content,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
    setAddNote({ title: "", content: "" });
  };

  // Delete note
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    setMessage("Note deleted successfully.");
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      setMessage("");
    }, 2000);
  };

  // Start editing
  const handleEdit = (note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    await updateDoc(doc(db, "notes", id), {
      title: editTitle,
      content: editContent,
    });
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  };

  return (
    <>
      <Modal type="Notes" message={message} isOpen={isOpen} />
      <div
        className={`w-full pb-2 ${
          isDark ? "bg-[#1B1B1B] text-white" : "text-gray-700"
        }`}
      >
        <div className="pb-2 sticky top-0 z-10">
          <div
            className={`${
              isDark ? "bg-[#1B1B1B]" : "bg-white"
            } flex justify-between items-center pt-2 px-3 `}
          >
            <h1 className="text-2xl font-bold my-2  ">Your Notes</h1>
            <div className="w-1/2">
              <Input
                type="search"
                placeholder="Search notes..."
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>

        {/* Add note inputs and button */}
        {user && (
          <div className="flex items-center gap-6 sm:gap-2 mb-6 px-3 flex-wrap sm:flex-nowrap  ">
            <Input
              type="text"
              name="title"
              placeholder="Add a new note title..."
              value={addNote.title}
              onChange={inputHandler}
              error={error.title}
            />
            <Input
              type="text"
              name="content"
              placeholder="Add note content..."
              value={addNote.content}
              onChange={inputHandler}
              error={error.content}
            />
            <button
              className={`${
                isDark ? "bg-[#313131]" : "bg-gray-100"
              } whitespace-nowrap py-2 px-2 rounded-md cursor-pointer`}
              onClick={handleAddNote}
            >
              Add Note
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 sm:mb-0 px-4 pt-4 pb-3">
          {!user ? (
            <h2 className="text-center text-gray-400 col-span-full py-10">
              Please log in to see your notes.
            </h2>
          ) : loading ? (
            <TaskSkeleton count={12} />
          ) : filetedData.length === 0 ? (
            <h2 className="text-center text-gray-400 col-span-full py-10">
              No notes found.
            </h2>
          ) : (
            filetedData.map((note) => (
              <div
                key={note.id}
                className={`p-4 shadow-sm rounded-md ${
                  isDark ? "bg-[#313131]" : "bg-[#F3F4F6]"
                } `}
              >
                {editId === note.id ? (
                  <>
                      <div className="border-b rounded mb-2">
                    <Input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mb-2"
                    />
                      </div>
                    <Input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-2 border"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
                        onClick={() => handleSaveEdit(note.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded cursor-pointer"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
                    <p className="text-sm">{note.content}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className=" text-white  py-1 rounded flex items-center justify-center cursor-pointer"
                        onClick={() => handleEdit(note)}
                        title="Edit"
                      >
                        {/* Pencil Icon */}
                        ✏️
                      </button>
                      <button
                        className=" text-white  cursor-pointer  py-1 rounded flex items-center justify-center "
                        onClick={() => handleDelete(note.id)}
                        title="Delete"
                      >
                        {/* Trash Icon */}
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notes;
