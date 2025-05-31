import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
const COLORS = ["#FFBB28", "#FF8042", "#00C49F"]

const Analytics = () => {
  // real data fetching would go here
  const [user, setUser] = useState(null);
  // Example: Show productivity stats (replace with real data)
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setCompletedTasks(0);
      setPendingTasks(0);
      setNotesCount(0);
      setTotalTasks(0);
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
      let total = 0;
      snapshot.forEach((doc) => {
        total++;
        if (doc.data().completed) completed++;
        else pending++;
      });
      setCompletedTasks(completed);
      setPendingTasks(pending);
      setTotalTasks(total); // <-- Set total tasks here
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
  // Aggregated data for graphs
  const [tasksByDate, setTasksByDate] = useState([]);
  const [notesByDate, setNotesByDate] = useState([]);

  useEffect(() => {
    if (!user) {
      setTasksByDate([]);
      setNotesByDate([]);
      setCategoryData([]);
      return;
    }

    // Tasks aggregation
    const tasksQuery = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid)
    );
    const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
      const dateMap = {};
      const categoryMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Date aggregation
        const date = data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString().slice(0, 10)
          : "Unknown";
        if (!dateMap[date]) dateMap[date] = { date, completed: 0, pending: 0 };
        if (data.completed) dateMap[date].completed += 1;
        else dateMap[date].pending += 1;

        // Category aggregation
        const category = data.category || "Uncategorized";
        if (!categoryMap[category]) categoryMap[category] = 0;
        categoryMap[category] += 1;
      });
      setTasksByDate(
        Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date))
      );
      setCategoryData(
        Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
      );
    });

    // Notes aggregation
    const notesQuery = query(
      collection(db, "notes"),
      where("uid", "==", user.uid)
    );
    const unsubNotes = onSnapshot(notesQuery, (snapshot) => {
      const dateMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        let date = "Unknown";
        if (data.createdAt?.toDate) {
          try {
            date = data.createdAt.toDate().toISOString().slice(0, 10);
          } catch (e) {
            date = "Unknown";
          }
        }
        if (!dateMap[date]) dateMap[date] = { date, notes: 0 };
        dateMap[date].notes += 1;
      });

      setNotesByDate(
        Object.values(dateMap).sort((a, b) => {
          if (a.date === "Unknown") return 1;
          if (b.date === "Unknown") return -1;
          return a.date.localeCompare(b.date);
        })
      );
    });

    return () => {
      unsubTasks();
      unsubNotes();
    };
  }, [user]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Productivity Analytics</h2>
      
      {/* Productivity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-orange-100 text-orange-800 rounded p-4 text-center">
          <div className="text-lg font-bold">{completedTasks}</div>
          <div>Tasks Completed</div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 rounded p-4 text-center">
          <div className="text-lg font-bold">{pendingTasks}</div>
          <div>Tasks Pending</div>
        </div>
        <div className="bg-blue-100 text-blue-800 rounded p-4 text-center">
          <div className="text-lg font-bold">{notesCount}</div>
          <div>Notes Written</div>
        </div>
      </div>

      {/* Graphs & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart: Tasks Completed/Pending */}
        <div>
          <h3 className="font-semibold mb-2">Tasks Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tasksByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#FFBB28" name="Completed" />
              <Bar dataKey="pending" fill="#FF8042" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Category Breakdown */}
        <div>
          <h3 className="font-semibold mb-2">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        
      </div>

      {/* Line Chart: Notes Over Time */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Notes Written Over Time</h3>
        <div className="mb-2 text-sm text-gray-600">
          Total Notes: {notesByDate.reduce((sum, d) => sum + d.notes, 0)}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={notesByDate}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="notes" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Goal Progress */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Goal Progress</h3>
        <div className="flex items-center gap-4">
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-green-400 h-4 rounded"
              style={{
                width: `${(completedTasks / totalTasks) * 100}%`,
              }}
            ></div>
          </div>
          <span>
            {completedTasks} / {totalTasks} Total goals
          </span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
