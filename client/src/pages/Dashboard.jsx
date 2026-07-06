import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalNotes: 0, joinedGroups: 0, aiQueriesUsed: 0, userName: 'Student' });
  const [groups, setGroups] = useState([]);
  const [notes, setNotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, groupsRes, notesRes, messagesRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/groups'),
          api.get('/notes'),
          api.get('/groups/recent-messages'),
        ]);
        setStats(statsRes.data);
        setGroups(groupsRes.data.slice(0, 4));
        setNotes(notesRes.data.slice(0, 4));
        setMessages(messagesRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-500">Loading dashboard...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back, {stats.userName}</h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your studies today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Notes</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.totalNotes}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Joined Groups</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.joinedGroups}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">AI Queries Used</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{stats.aiQueriesUsed}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Joined Groups</h3>
            {groups.length === 0 ? (
              <p className="text-gray-400 text-sm">No groups joined yet.</p>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-gray-500">{group.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{group.members?.length || 0} members</p>
                    </div>
                    <button
                      onClick={() => navigate('/groups')}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Recent Notes</h3>
            {notes.length === 0 ? (
              <p className="text-gray-400 text-sm">No notes created yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note._id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{note.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{note.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent messages from groups.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                    {msg.userName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{msg.userName}</span>
                      <span className="text-gray-400"> in </span>
                      <span className="text-indigo-600">{msg.groupName}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
