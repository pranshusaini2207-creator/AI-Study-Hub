import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const { data } = await api.post('/ai/chat', { question });
      setAnswer(data.answer);
      setHistory([
        { question, answer: data.answer, time: new Date() },
        ...history,
      ]);
      setQuestion('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Assistant</h2>
          <p className="text-gray-500 mt-1">Ask any study-related question and get instant help.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here... e.g. Explain photosynthesis in simple terms"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        {answer && (
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-semibold text-indigo-700 mb-2">AI Response</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Previous Questions</h3>
            {history.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="font-medium text-gray-800">Q: {item.question}</p>
                <p className="text-gray-600 mt-2 text-sm line-clamp-3">A: {item.answer}</p>
                <p className="text-xs text-gray-400 mt-2">{item.time.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIAssistant;
