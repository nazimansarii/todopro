import React, { useContext, useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Input } from "./Input";
import { ThemeContext } from "../context/ThemeContext";
import Option from "./Option";

import {
  collection,
  addDoc,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  query as firestoreQuery,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router";
import TaskSkeleton from "./TaskSkeleton";
import Modal from "./Modal";

export const TodayTask = ({ top }) => {
  const [isDark] = useContext(ThemeContext);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const [sortCallback, setSortCallback] = useState(() => () => {});
  const [isOpen, setIsOpen] = useState(false);

  // Filter hooks
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Helper to guess task type
  const getTaskType = (text) => {
    const lower = text.toLowerCase();

    // Health
    if (
      lower.includes("doctor") ||
      lower.includes("hospital") ||
      lower.includes("health") ||
      lower.includes("medicine") ||
      lower.includes("appointment") ||
      lower.includes("clinic")
    )
      return "Health";

    // Shopping
    if (
      lower.includes("shopping") ||
      lower.includes("shop") ||
      lower.includes("purchase") ||
      lower.includes("buy") ||
      lower.includes("mall") ||
      lower.includes("clothes") ||
      lower.includes("dress") ||
      lower.includes("shoes") ||
      lower.includes("grocery") ||
      lower.includes("vegetable") ||
      lower.includes("supermarket") ||
      lower.includes("store") ||
      lower.includes("market")
    )
      return "Shopping";

    // Market (for other market-related but not shopping)
    if (
      lower.includes("vegetable market") ||
      lower.includes("farmer") ||
      lower.includes("bazaar")
    )
      return "Market";

    // Movie
    if (
      lower.includes("movie") ||
      lower.includes("cinema") ||
      lower.includes("film") ||
      lower.includes("theater") ||
      lower.includes("watch movie")
    )
      return "Movie";

    // Study
    if (
      lower.includes("school") ||
      lower.includes("study") ||
      lower.includes("exam") ||
      lower.includes("homework") ||
      lower.includes("assignment") ||
      lower.includes("class") ||
      lower.includes("college")
    )
      return "Study";

    // Work
    if (
      lower.includes("work") ||
      lower.includes("office") ||
      lower.includes("meeting") ||
      lower.includes("project") ||
      lower.includes("deadline") ||
      lower.includes("client") ||
      lower.includes("job") ||
      lower.includes("shift")
    )
      return "Work";

    // Communication
    if (
      lower.includes("call") ||
      lower.includes("email") ||
      lower.includes("message") ||
      lower.includes("contact") ||
      lower.includes("meeting") ||
      lower.includes("zoom") ||
      lower.includes("skype")
    )
      return "Communication";

    // Home
    if (
      lower.includes("clean") ||
      lower.includes("laundry") ||
      lower.includes("wash") ||
      lower.includes("cook") ||
      lower.includes("dish") ||
      lower.includes("house") ||
      lower.includes("home") ||
      lower.includes("room") ||
      lower.includes("kitchen")
    )
      return "Home";

    // Finance
    if (
      lower.includes("pay") ||
      lower.includes("bill") ||
      lower.includes("bank") ||
      lower.includes("money") ||
      lower.includes("finance") ||
      lower.includes("salary") ||
      lower.includes("expense") ||
      lower.includes("budget")
    )
      return "Finance";

    // Travel
    if (
      lower.includes("travel") ||
      lower.includes("trip") ||
      lower.includes("flight") ||
      lower.includes("train") ||
      lower.includes("bus") ||
      lower.includes("airport") ||
      lower.includes("station") ||
      lower.includes("journey")
    )
      return "Travel";

    return "General";
  };

  const isOutsideTask = (type) => {
    return ["Market", "Travel", "Health", "Work", "Movie", "Shopping"].includes(
      type
    );
  };

  // Filtering logic
  const filterCallback = (task) => {
    // Status filter
    if (statusFilter === "completed" && !task.completed) return false;
    if (statusFilter === "pending" && task.completed) return false;
    // Category filter
    const type = getTaskType(task.text);
    if (categoryFilter !== "all" && type !== categoryFilter) return false;
    // Type filter (outdoor)
    if (
      typeFilter === "outdoor" &&
      !["Market", "Travel", "Health", "Work", "Movie", "Shopping"].includes(
        type
      )
    )
      return false;
    // Search filter
    if (query && !task.text.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  };

  const filteredTasks = tasks.filter(filterCallback);

  const navigate = useNavigate();
  // Listen for auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  // Fetch tasks for current user
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setError("Please log in to see your tasks.");
      return;
    }
    const q = firestoreQuery(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Add task to Firestore
  const handleAddTask = async () => {
    const duplicate = tasks.some(
      (t) => t.text.trim().toLowerCase() === task.trim().toLowerCase()
    );
    if (duplicate) {
      setInputError("Task with this title already exists.");
      return;
    }
    if (!user) {
      navigate("/account");
      return;
    }
    if (!task.trim() || !user) {
      setInputError("Please enter a task.");
      return;
    }
    setMessage("Task added successfully!");
    setIsOpen(true);

    setTimeout(() => {
      setIsOpen(false);
      setMessage("");
    }, 2000);
    const category = getTaskType(task);
    await addDoc(collection(db, "tasks"), {
      text: task,
      uid: user.uid,
      createdAt: serverTimestamp(),
      completed: false,
      category,
    });

    setTask("");
  };

  // Update handleRenameTask to just set editing state:
  const handleRenameTask = (id, oldText) => {
    setEditingId(id);
    setEditingValue(oldText);
  };

  // Add a save function:
  const handleSaveRename = async (id) => {
    if (editingValue.trim()) {
      await updateDoc(doc(db, "tasks", id), { text: editingValue });
    }
    setEditingId(null);
    setEditingValue("");
  };

  // Delete task function
  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setMessage("Task Deleted successfully!");
      setIsOpen(true);

      setTimeout(() => {
        setIsOpen(false);
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (id, current) => {
    await updateDoc(doc(db, "tasks", id), { completed: !current });
  };

  const API_KEY = "0c01ac8b8b645d9417fcee51f0edda9a";
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Step 2: Fetch weather using lat/lon
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.cod === 200) {
              setWeather(data);
              setError(null);
            } else {
              setError("Weather data not found.");
            }
          })
          .catch(() => setError("Failed to fetch weather."));
      },
      () => {
        setError("Location permission denied.");
      }
    );
  }, []);

  return (
    <>
      <Modal type="task" message={message} isOpen={isOpen} />
      <div
        className={`w-full   pb-10 sm:pb-2  ${
          isDark ? "bg-[#1B1B1B] text-white" : "text-gray-700"
        }`}
      >
        <div
          className={`flex px-3 sm:px-4  flex-wrap md:flex-nowrap justify-between items-center gap-2 sticky top-0 z-10 pt-3  ${
            isDark ? "bg-[#1B1B1B]" : "bg-white"
          } `}
        >
          <h1 className="font-bold text-xl pl-2">Today</h1>
          <div className="flex gap-2 flex-wrap items-center mb-2">
            <p
              className={`flex gap-2 items-center ${
                isDark ? "bg-[#313131]" : "bg-gray-100"
              } px-4 py-2 rounded-md text-sm`}
            >
              Sort by
              <FaArrowDown
                className="text-inherit cursor-pointer"
                title="Descending"
                onClick={() =>
                  setSortCallback(() => (a, b) => b.text.localeCompare(a.text))
                }
              />
              <FaArrowUp
                className="text-inherit cursor-pointer"
                title="Ascending"
                onClick={() =>
                  setSortCallback(() => (a, b) => a.text.localeCompare(b.text))
                }
              />
            </p>


            <select
              className={` ${
                isDark ? "bg-[#313131]" : "bg-gray-100"
              } px-4 py-2 rounded-md text-sm outline-none transition-all duration-200 `}
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <Option value={"all"} label={"All"} />
              <Option value={"completed"} label={"Completed"} />
              <Option value={"pending"} label={"Pending"} />
            </select>


            <select
              className={` ${
                isDark ? "bg-[#313131]" : "bg-gray-100"
              } px-4 py-2 rounded-md text-sm outline-none transition-all duration-200 `}
              name="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <Option value={"all"} label={"All Categories"} />
              <Option value={"Health"} label={"Health"} />
              <Option value={"Market"} label={"Market"} />
              <Option value={"Movie"} label={"Movie"} /> {/* Added */}
              <Option value={"Shopping"} label={"Shopping"} /> {/* Added */}
              <Option value={"Study"} label={"Study"} />
              <Option value={"Work"} label={"Work"} />
              <Option value={"Home"} label={"Home"} />
              <Option value={"Finance"} label={"Finance"} />
              <Option value={"Travel"} label={"Travel"} />
              <Option value={"Communication"} label={"Communication"} />
              <Option value={"General"} label={"General"} />
            </select>

            <select
              className={` ${
                isDark ? "bg-[#313131]" : "bg-gray-100"
              } px-4 py-2 rounded-md text-sm outline-none transition-all duration-200 `}
              name="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <Option value={"all"} label={"All Tasks"} />
              <Option value={"outdoor"} label={"Outdoor Tasks"} />
            </select>
          </div>
        </div>

        <div
          className={`flex justify-between items-center mb-4 gap-4 px-3 sm:px-4  pt-3
          ${isDark ? "bg-[#1B1B1B]" : "bg-white"} rounded-xl`}
        >
          {user ? (
            <>
              <div className="w-full">
                <Input
                  placeholder={"Add task"}
                  value={task}
                  onChange={(e) => {
                    setTask(e.target.value);
                    setInputError(null);
                  }}
                  error={inputError}
                />
              </div>
              <button
                className={` ${
                  isDark ? "bg-[#313131]" : "bg-gray-100"
                } whitespace-nowrap py-2 px-2 rounded-md cursor-pointer`}
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </>
          ) : (
            ""
          )}
        </div>

        {/* daily tasks */}
        <div className={`  py-4 px-3 sm:px-4`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {!user ? (
              <h1 className="text-center text-lg text-gray-400 col-span-full py-10">
                Please log in to see your tasks.
              </h1>
            ) : loading ? (
              <TaskSkeleton count={12} />
            ) : filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.sort(sortCallback).map((t) => {
                const type = getTaskType(t.text);

                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl p-4 shadow-md flex flex-col justify-between transition hover:shadow-lg ${
                      isDark ? "bg-[#313131] text-white" : "bg-gray-100"
                    }`}
                  >
                    {/* Task Header */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 mt-1 accent-blue-500 cursor-pointer"
                        checked={!!t.completed}
                        onChange={() => handleToggleComplete(t.id, t.completed)}
                      />
                      <div className="flex-1">
                        {editingId === t.id ? (
                          <input
                            className="text-base font-semibold bg-transparent border-b border-blue-400 outline-none w-full"
                            value={editingValue}
                            autoFocus
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() => handleSaveRename(t.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(t.id);
                              if (e.key === "Escape") {
                                setEditingId(null);
                                setEditingValue("");
                              }
                            }}
                          />
                        ) : (
                          <h2
                            className={`text-lg font-semibold break-words ${
                              t.completed ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {t.text}
                          </h2>
                        )}
                        <p className="text-xs text-gray-500">
                          {t.createdAt?.toDate?.().toLocaleString?.() || ""}
                        </p>
                      </div>
                    </div>

                    {/* Weather Info */}
                    {isOutsideTask(type) && (
                      <div className="mt-2 text-xs">
                        {error ? (
                          <span className="text-red-400">{error}</span>
                        ) : (
                          weather &&
                          weather.main && (
                            <span className="text-amber-500">
                              🌤 {weather.weather[0].main}, {weather.main.temp}
                              °C
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={`px-3 py-0.5 text-xs font-medium rounded-full ${
                          type === "Health"
                            ? "bg-red-100 text-red-600"
                            : type === "Market"
                            ? "bg-green-100 text-green-600"
                            : type === "Study"
                            ? "bg-blue-100 text-blue-600"
                            : type === "Work"
                            ? "bg-yellow-100 text-yellow-600"
                            : type === "Movie"
                            ? "bg-purple-100 text-purple-600"
                            : type === "Shopping"
                            ? "bg-pink-100 text-pink-600"
                            : type === "Communication"
                            ? "bg-cyan-100 text-cyan-600"
                            : type === "Home"
                            ? "bg-orange-100 text-orange-600"
                            : type === "Finance"
                            ? "bg-teal-100 text-teal-600"
                            : type === "Travel"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {type}
                      </span>

                      <div className="flex items-center gap-2 text-sm">
                        {editingId !== t.id && (
                          <button
                            onClick={() => handleRenameTask(t.id, t.text)}
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            title="Rename"
                          >
                            ✏️
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1 className="text-center text-lg text-gray-400 col-span-full py-10">
                {(() => {
                  if (error) {
                    return error;
                  }
                  if (tasks.length === 0) {
                    return "No tasks found. Add your first task!";
                  }
                  if (filteredTasks.length === 0) {
                    if (statusFilter !== "all") {
                      return `No tasks found for status: ${statusFilter}.`;
                    }
                    if (categoryFilter !== "all") {
                      return `No tasks found in category: ${categoryFilter}.`;
                    }
                    if (typeFilter !== "all") {
                      return `No tasks found for type: ${
                        typeFilter === "outdoor" ? "Outdoor Tasks" : typeFilter
                      }.`;
                    }
                    return "No tasks match your current filters.";
                  }
                  return "No tasks to display.";
                })()}
              </h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
