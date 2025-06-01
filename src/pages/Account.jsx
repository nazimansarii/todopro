import React, { useContext, useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import { signOut, deleteUser } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import Modal from "../components/Modal";

export const Account = () => {
  const [isDark] = useContext(ThemeContext);
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  // Stats
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalType, setModalType] = useState("info");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Notes count
    const fetchNotes = async () => {
      const notesQuery = query(
        collection(db, "notes"),
        where("uid", "==", user.uid)
      );
      const notesSnap = await getCountFromServer(notesQuery);
      setTotalNotes(notesSnap.data().count || 0);
    };
    // Tasks count
    const fetchTasks = async () => {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid)
      );
      const tasksSnap = await getCountFromServer(tasksQuery);
      setTotalTasks(tasksSnap.data().count || 0);

      // Completed tasks
      const completedQuery = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid),
        where("completed", "==", true)
      );
      const completedSnap = await getCountFromServer(completedQuery);
      setCompletedTasks(completedSnap.data().count || 0);

      // Pending tasks
      const pendingQuery = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid),
        where("completed", "==", false)
      );
      const pendingSnap = await getCountFromServer(pendingQuery);
      setPendingTasks(pendingSnap.data().count || 0);
    };

    fetchNotes();
    fetchTasks();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setModalType("logout");
      setModalMsg("You have been logged out.");
      setModalOpen(true);
    } catch (error) {
      setModalType("logout");
      setModalMsg("Logout failed. Please try again.");
      setModalOpen(true);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteUser(auth.currentUser);
      setModalType("delete");
      setModalMsg("Your account has been deleted successfully.");
      setModalOpen(true);
      setShowDeleteConfirm(false);
    } catch (error) {
      setModalType("delete");
      setModalMsg("Delete account error: " + (error?.message || "Unknown error"));
      setModalOpen(true);
      setShowDeleteConfirm(false);
    }
  };

  if (!user) {
    return (
      <div
        className={`${
          isDark ? "bg-[#1B1B1B] text-white" : ""
        } text-gray-800   w-full min-h-screen px-4`}
      >
        <header className="text-center mb-2 md:mb-3">
          <FaChevronLeft
            className="text-gray-400 text-xl  cursor-pointer mt-4 ml-4"
            onClick={() => history.back()}
          />
          <h1 className="text-xl md:text-2xl font-extrabold ">Account</h1>

          <div>
            {showSignup ? (
              <>
                <Signup />
                <p>
                  Already have an account?{" "}
                  <button
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => setShowSignup(false)}
                  >
                    Login
                  </button>
                </p>
              </>
            ) : (
              <>
                <Login />
                <p>
                  Don't have an account?{" "}
                  <button
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => setShowSignup(true)}
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
          </div>
        </header>
      </div>
    );
  }

  // Show account info if logged in
  return (
    <div
      className={`h-fit sm:h-screen pb-10  sm:overflow-y-scroll  custom-scrollbar ${
        isDark ? "bg-[#1B1B1B] text-white" : " text-[#1B1B1B]"
      } w-full  sm:flex-row p-0 `}
    >
      {/* Modal for info, logout, delete */}
      <Modal type={modalType} message={modalMsg} isOpen={modalOpen} />
      {/* Modal for delete confirmation */}
      {showDeleteConfirm && (
        <>
          {/* Prevent background scroll when modal is open */}
          <style>{`body { overflow: hidden !important; }`}</style>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
            <div className={`bg-white dark:bg-[#232323] rounded-lg shadow-lg p-6 max-w-sm w-full`}>
              <h3 className="text-lg font-bold mb-3 text-red-600">Delete Account</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 cursor-pointer"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  onClick={confirmDeleteAccount}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <FaChevronLeft
        className="text-gray-400 text-xl  cursor-pointer mt-4 ml-4"
        onClick={() => history.back()}
      />
      <h2 className="text-2xl font-extrabold mb-6 text-center tracking-tight">
        👤 Account Overview
      </h2>
      <div className="px-2 sm:px-5    rounded-2xl  sm:p-6 mb-8  ">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-bold text-blue-700">
            Welcome, {user.displayName || user.email}!
          </span>
          <div className="w-full mt-4 ">
            <div className="flex flex-col gap-4">
              <div
                className={`${
                  isDark ? "bg-[#313131] " : ""
                } rounded-lg px-5 py-4 shadow flex w-full  flex-col items-center`}
              >
                <span className="text-3xl font-extrabold text-blue-700">
                  {totalTasks}
                </span>
                <span className="text-base font-semibold text-blue-600">
                  Total Tasks
                </span>
                <div className="flex gap-6 mt-2">
                  <span className="text-green-700 font-medium">
                    ✔ Completed: {completedTasks}
                  </span>
                  <span className="text-yellow-700 font-medium">
                    ⏳ Pending: {pendingTasks}
                  </span>
                </div>
              </div>
              <div
                className={`${
                  isDark ? "bg-[#313131] " : ""
                } rounded-lg px-5 py-4 shadow flex flex-col items-center`}
              >
                <span className="text-3xl font-extrabold text-purple-400">
                  {totalNotes}
                </span>
                <span className="text-base font-semibold text-purple-400">
                  Total Notes
                </span>
              </div>
              {/* --- New Features Section --- */}
              <div
                className={`${
                  isDark ? "bg-[#313131] " : ""
                } rounded-lg px-5 py-4 shadow flex flex-col items-center`}
              >
                <span className="text-lg font-semibold text-gray-400 mb-2">
                  📊 Your Productivity Stats
                </span>
                <div className="flex flex-col gap-1 text-sm text-gray-400 w-full">
                  <div>
                    <span className="font-bold">Completion Rate: </span>
                    {totalTasks > 0
                      ? `${Math.round((completedTasks / totalTasks) * 100)}%`
                      : "0%"}
                  </div>
                  <div>
                    <span className="font-bold">Pending Ratio: </span>
                    {totalTasks > 0
                      ? `${Math.round((pendingTasks / totalTasks) * 100)}%`
                      : "0%"}
                  </div>
                  <div>
                    <span className="font-bold">Notes/Task Ratio: </span>
                    {totalTasks > 0
                      ? (totalNotes / totalTasks).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </div>
              <div
                className={`${
                  isDark ? "bg-[#313131] " : ""
                } rounded-lg px-5 py-4 shadow flex flex-col items-center`}
              >
                <span className="text-lg font-semibold text-gray-400 mb-2">
                  🕒 Last Login
                </span>
                <span className="text-sm text-gray-400">
                  {user.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-yellow-100 shadow-md border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <strong className="block mb-1">🚨 Very Important:</strong>
          <ul className="list-disc pl-5 text-sm">
            <li>Your tasks and notes are securely stored in your account.</li>
            <li>
              Deleting your account will <b>permanently</b> remove all your
              data.
            </li>
            <li>To keep your data safe, always log out from public devices.</li>
            <li>
              <b>Tip:</b> Use notes to keep track of ideas, reminders, and
              important info!
            </li>
            <li>
              <b>Need help?</b> Contact support at{" "}
              <a
                href="mailto:support@example.com"
                className="underline text-blue-700"
              >
                support@todo.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center gap-5 items-center mt-8 mb-12 ms:my-4">
        <button
          onClick={handleLogout}
          className="p-2 bg-amber-600 cursor-pointer text-white rounded hover:bg-amber-700"
        >
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className="p-2 bg-red-700 text-white rounded cursor-pointer hover:bg-red-800"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};
