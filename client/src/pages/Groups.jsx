import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Groups = () => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGroups = async () => {
    try {
      const [joinedRes, allRes] = await Promise.all([api.get('/groups'), api.get('/groups/all')]);
      setJoinedGroups(joinedRes.data);
      setAllGroups(allRes.data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/groups', { name, subject });
      setJoinedGroups([data, ...joinedGroups]);
      setAllGroups([data, ...allGroups]);
      setName('');
      setSubject('');
      setSuccess('Group created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (groupId) => {
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post(`/groups/join/${groupId}`);
      setJoinedGroups((prev) => {
        const exists = prev.some((g) => g._id === data._id);
        return exists ? prev.map((g) => (g._id === data._id ? data : g)) : [data, ...prev];
      });
      setAllGroups(allGroups.map((g) => (g._id === data._id ? data : g)));
      setSuccess('Joined group successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group.');
    }
  };

  const isMember = (group) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return group.members?.some((m) => (m._id || m) === user.id);
  };

  const createdCount = joinedGroups.filter((g) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (g.createdBy?._id || g.createdBy) === user.id;
  }).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Study Groups</h2>
          <p className="text-gray-500 mt-1">
            Create or join study groups. You can create up to 3 groups ({createdCount}/3 used).
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">{success}</div>}

        <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-700">Create New Group</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name"
              required
              disabled={createdCount >= 3}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (e.g. Mathematics)"
              required
              disabled={createdCount >= 3}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || createdCount >= 3}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {createdCount >= 3 ? 'Limit Reached (3/3)' : submitting ? 'Creating...' : 'Create Group'}
          </button>
        </form>

        <section className="space-y-4">
          <h3 className="font-semibold text-gray-700">My Joined Groups</h3>
          {loading ? (
            <p className="text-gray-500">Loading groups...</p>
          ) : joinedGroups.length === 0 ? (
            <p className="text-gray-400">You haven't joined any groups yet.</p>
          ) : (
            joinedGroups.map((group) => (
              <div
                key={group._id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{group.name}</h4>
                    <p className="text-sm text-gray-500">{group.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">{group.members?.length || 0} members</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {group.members?.slice(0, 5).map((member) => (
                        <span
                          key={member._id || member}
                          className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
                        >
                          {member.name || 'Member'}
                        </span>
                      ))}
                      {(group.members?.length || 0) > 5 && (
                        <span className="text-xs text-gray-400">+{group.members.length - 5} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="space-y-4">
          <h3 className="font-semibold text-gray-700">All Available Groups</h3>
          {allGroups.length === 0 ? (
            <p className="text-gray-400">No groups available yet.</p>
          ) : (
            allGroups.map((group) => (
              <div
                key={group._id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold text-gray-800">{group.name}</h4>
                  <p className="text-sm text-gray-500">{group.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {group.members?.length || 0} members · Created by {group.createdBy?.name || 'Unknown'}
                  </p>
                </div>
                {isMember(group) ? (
                  <span className="text-sm text-green-600 font-medium px-4 py-2 bg-green-50 rounded-lg">
                    Joined
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoin(group._id)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                  >
                    Join
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Groups;
