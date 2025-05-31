import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const ProductivityGraph = ({ completedTasks, pendingTasks, notesCount }) => {
  const data = [
    {
      name: 'Tasks Completed',
      value: completedTasks,
      fill: '#06b6d4',
    },
    {
      name: 'Tasks Pending',
      value: pendingTasks,
      fill: '#a78bfa',
    },
    {
      name: 'Notes',
      value: notesCount,
      fill: '#f472b6',
    },
  ];

  return (
    <div className="w-full h-64 sm:h-96 bg-gray-900 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">Your Productivity Overview</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" allowDecimals={false} />
          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} />
          <Legend />
          <Bar dataKey="value" isAnimationActive fill="#06b6d4" label={{ position: 'top', fill: '#fff' }}>
            {data.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
