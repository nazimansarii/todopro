import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ProductivityGraph } from "../components/ProductivityGraph";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const Home = () => {
  const [isDark] = useContext(ThemeContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // Example: Show productivity stats (replace with real data)
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  //   date
  const [date, setDate] = useState(new Date().toLocaleString());
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);
  const username = user?.displayName || user?.email || "User";

  useEffect(() => {
    if (!user) {
      setCompletedTasks(0);
      setPendingTasks(0);
      setNotesCount(0);
      return;
    }

    // Real-time tasks
    const tasksQuery = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid)
    );
    const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
      let completed = 0;
      let pending = 0;
      snapshot.forEach((doc) => {
        if (doc.data().completed) completed++;
        else pending++;
      });
      setCompletedTasks(completed);
      setPendingTasks(pending);
    });

    // Real-time notes
    const notesQuery = query(
      collection(db, "notes"),
      where("uid", "==", user.uid)
    );
    const unsubNotes = onSnapshot(notesQuery, (snapshot) => {
      setNotesCount(snapshot.size);
    });

    return () => {
      unsubTasks();
      unsubNotes();
    };
  }, [user]);

  return (
    <section
      className={`w-full h-fit sm:max-h-screen sm:overflow-auto custom-scrollbar ${
        isDark ? "bg-[#1B1B1B] text-white" : "text-gray-700"
      } `}
    >
      <header
        className={`flex items-center  justify-center sm:justify-between gap-5 px-4 py-6 sm:px-8  border-gray-800  ${
          isDark ? "bg-[#1B1B1B]" : "bg-white"
        }`}
      >
        <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">
          Empowering Productivity for Professionals
        </p>
        <button
          className={`px-6 py-2 text-sm font-medium text-white ${
            user ? "bg-red-600" : "bg-gradient-to-r from-cyan-500 to-purple-500"
          }  rounded-full shadow hover:from-cyan-600 hover:to-purple-600 transition cursor-pointer`}
          onClick={() => navigate("/account")}
        >
          {user ? "Logout" : "Login"}
        </button>
      </header>

      <section className="flex flex-wrap pb-15 sm:pb-3">
        <div className="w-full sm:w-1/2  flex flex-col">
          <p className="text-2xl font-semibold text-cyan-400 mb-6 px-8">
            {username ? `Welcome, ${username}!` : "Welcome, Guest!"}
            <span className="block text-base font-normal text-gray-400 mt-2">
              Discover the world’s best to-do app and boost your productivity
              every day.
            </span>
          </p>
          <div className="px-8">
            <h1 className="mt-6 text-4xl font-normal text-white sm:mt-10 sm:text-3xl lg:text-4xl xl:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                Organize Your Workflow
              </span>{" "}
              Efficiently
            </h1>
            <p className="max-w-lg mt-4 text-xl font-normal text-gray-400 sm:mt-8">
              Streamline your daily tasks, set clear priorities, and achieve
              your objectives with ease. Our platform is designed to help you
              stay focused, productive, and in control of your schedule.
            </p>
          </div>
        </div>

        <aside className="w-full sm:w-1/2  sm:pt-10 ">
          <img
            className="w-full max-w-xs mx-auto lg:max-w-lg xl:max-w-xl"
            src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/1/3d-illustration.png"
            alt=""
          />
        </aside>

        {/* --- Engaging Motivation Section --- */}
        <div className="mt-10 bg-gradient-to-r from-cyan-700 to-purple-700 rounded-xl shadow-lg p-6 flex flex-col gap-4 mx-auto">
          <h3 className="text-white text-xl font-bold mb-2 flex items-center gap-2">
            🚀 Boost Your Day!
          </h3>
          <ul className="list-disc list-inside text-white/90 text-base space-y-2">
            <li>
              <span className="font-semibold text-cyan-200">
                Set a daily goal
              </span>{" "}
              and celebrate your wins.
            </li>
            <li>
              <span className="font-semibold text-purple-200">Reflect</span> on
              your progress every evening.
            </li>
            <li>
              <span className="font-semibold text-cyan-200">Stay inspired</span>{" "}
              with our productivity tips.
            </li>
            <li>
              <span className="font-semibold text-purple-200">
                Share your achievements
              </span>{" "}
              with friends!
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-cyan-100 text-sm">
              “Success is the sum of small efforts, repeated day in and day
              out.” – Robert Collier
            </span>
            <button
              className="mt-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full font-semibold shadow hover:from-cyan-600 hover:to-purple-600 transition cursor-pointer"
              onClick={() => navigate("/account")}
            >
              {user ? "Go to My Account" : "Get Started"}
            </button>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <div className="mt-12 px-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-purple-400 mb-4">
          What Our Users Say
        </h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-base text-gray-400 italic">
              “TodoPro keeps me organized and motivated every day. Love the
              clean design!”
            </p>
            <span className="block mt-2 text-sm text-cyan-300 font-semibold">
              — Sarah, Designer
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-base text-gray-400 italic">
              “The reminders and daily goals help me stay on track with my work
              and studies.”
            </p>
            <span className="block mt-2 text-sm text-purple-300 font-semibold">
              — Ahmed, Student
            </span>
          </div>
        </div>
      </div>

      {/* --- Why Choose Us Section --- */}
      <div className="mt-12 px-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">
          Why Choose TodoPro?
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
          <li className="bg-white/10 rounded-lg p-4 flex items-center gap-2">
            <span className="text-cyan-400 text-xl">🔒</span>
            <span>Secure cloud sync for all your devices</span>
          </li>
          <li className="bg-white/10 rounded-lg p-4 flex items-center gap-2">
            <span className="text-purple-400 text-xl">⚡</span>
            <span>Lightning-fast and distraction-free</span>
          </li>
          <li className="bg-white/10 rounded-lg p-4 flex items-center gap-2">
            <span className="text-cyan-400 text-xl">📱</span>
            <span>Mobile-friendly and responsive</span>
          </li>
          <li className="bg-white/10 rounded-lg p-4 flex items-center gap-2">
            <span className="text-purple-400 text-xl">💡</span>
            <span>
              Smart Analytics
              <span className="block text-xs text-purple-300 mt-1">
                Visualize your productivity trends, track your task, notes and
                get actionable insights to improve your workflow.
              </span>
            </span>
          </li>
          <li className="bg-white/10 rounded-lg p-4 flex items-center gap-2">
            <span className="text-cyan-400 text-xl">🌤️</span>
            <span>Integrated weather updates</span>
          </li>
          <li className="bg-white/10 rounded-lg p-4 flex items-center gap-2">
            <span className="text-purple-400 text-xl">🛡️</span>
            <span>Privacy-first: your data is yours</span>
          </li>
        </ul>
      </div>

      {/* --- Footer --- */}
      <footer
        className={`w-full mt-10 py-6 px-4 border-t ${
          isDark ? "border-gray-800 bg-[#18181b]" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="max-w-5xl mb-10 sm:mb-0 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TodoPro. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <a
              href="mailto:support@todo.com"
              className="text-cyan-500 hover:underline"
            >
              Contact Support
            </a>

            <span className="text-gray-400 hidden sm:inline">|</span>
            <span className="text-gray-400">{date}</span>
          </div>
        </div>
      </footer>
    </section>
  );
};
