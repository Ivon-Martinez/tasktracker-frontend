// import './App.css';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showOptions, setShowOptions] = useState(null);

  useEffect(() => {
    fetch('http://tasktracker-backend:5000/tasks')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const formattedTasks = data.tasks.map(taskArr => ({
          id: taskArr[0],
          title: taskArr[1],
        }));
        setTasks(formattedTasks);
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
        toast.error('Failed to load tasks.');
      });
  }, []);

  const addTask = () => {
    if (!title.trim()) {
      toast.error('Task name cannot be empty');
      return;
    }

    fetch('http://tasktracker-backend:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description: '' }),
    })
      .then(res => res.json())
      .then(data => {
        setTasks([...tasks, { id: data.task_id, title }]);
        setTitle('');
        toast.success('Task added');
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to add task.');
      });
  };

  const deleteTask = (id) => {
    fetch('http://tasktracker-backend:5000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Task deleted');
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to delete task.');
      });
  };

  const startEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
    setShowOptions(null);
  };

  const saveEdit = (id) => {
    if (!editingTitle.trim()) {
      toast.error('Task name cannot be empty');
      return;
    }

    fetch('http://tasktracker-backend:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: editingTitle, description: '' }),
    })
      .then(res => res.json())
      .then(() => {
        setTasks(tasks.map(task => task.id === id ? { ...task, title: editingTitle } : task));
        setEditingId(null);
        setEditingTitle('');
        toast.success('Task updated');
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to update task.');
      });
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Task Tracker</h1>

      <div className="flex mb-6 gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task"
          className="flex-grow border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={addTask}
          disabled={!title.trim()}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
            !title.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Add
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.length === 0 ? (
          <li className="text-center text-gray-500 italic">No tasks found</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center group"
            >
              {editingId === task.id ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-grow border border-gray-300 px-3 py-2 rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-gray-800">{task.title}</span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowOptions(showOptions === task.id ? null : task.id)
                      }
                      className="text-2xl font-bold px-2 text-gray-500 hover:text-gray-700"
                    >
                      &#x22EE;
                    </button>
                    {showOptions === task.id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow z-10">
                        <button
                          onClick={() => startEdit(task.id, task.title)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  </div>
);

}

export default App;
