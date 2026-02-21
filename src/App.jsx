import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Search, Calendar, Flag, Tag, Grid, List, ChevronDown, X } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [selectedDate, setSelectedDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [showAddForm, setShowAddForm] = useState(false);

  const priorities = [
    { value: 'high', label: 'High', color: 'from-red-500 to-red-600' },
    { value: 'medium', label: 'Medium', color: 'from-amber-500 to-amber-600' },
    { value: 'low', label: 'Low', color: 'from-blue-500 to-blue-600' },
  ];

  const categories = [
    { value: 'work', label: 'Work', color: 'bg-blue-500/20 text-blue-300' },
    { value: 'personal', label: 'Personal', color: 'bg-purple-500/20 text-purple-300' },
    { value: 'shopping', label: 'Shopping', color: 'bg-pink-500/20 text-pink-300' },
    { value: 'health', label: 'Health', color: 'bg-green-500/20 text-green-300' },
  ];

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        priority: selectedPriority,
        category: selectedCategory,
        dueDate: selectedDate,
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
      setInputValue('');
      setSelectedDate('');
      setShowAddForm(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || 'from-amber-500 to-amber-600';
  };

  const getCategoryColor = (category) => {
    return categories.find(c => c.value === category)?.color || 'bg-slate-500/20 text-slate-300';
  };

  const filteredTasks = tasks.filter(task => {
    let matches = true;

    if (filter === 'active') matches = !task.completed;
    else if (filter === 'completed') matches = task.completed;

    if (searchQuery) {
      matches = matches && task.text.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return matches;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.id - a.id;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const highPriorityCount = tasks.filter(t => !t.completed && t.priority === 'high').length;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Task Board
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-cyan-500/30 text-cyan-400'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500/30 text-cyan-400'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>
          <p className="text-slate-400">Organize your work with priorities and categories</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-cyan-400">{activeCount}</p>
              </div>
              <div className="text-slate-600"><Check size={32} /></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">High Priority</p>
                <p className="text-3xl font-bold text-red-400">{highPriorityCount}</p>
              </div>
              <div className="text-slate-600"><Flag size={32} /></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-400">{completedCount}</p>
              </div>
              <div className="text-slate-600"><Check size={32} /></div>
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-4 animate-slide-up">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === 'active'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Completed
            </button>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
            />
          </div>
        </div>

        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Add New Task
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600/50 animate-slide-up">
            <form onSubmit={addTask} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="What needs to be done?"
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  >
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  >
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Due Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-3'}>
          {sortedTasks.length === 0 ? (
            <div className="col-span-full text-center py-16 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                <Search size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg">
                {filter === 'completed' ? 'No completed tasks yet' :
                 filter === 'active' ? 'No active tasks' :
                 'No tasks yet. Add one to get started!'}
              </p>
            </div>
          ) : (
            sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="group relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/50 hover:border-slate-500 transition-all duration-300 animate-slide-in hover:shadow-lg hover:shadow-cyan-500/10"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      task.completed
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500'
                        : 'border-slate-600 hover:border-cyan-500'
                    }`}
                  >
                    {task.completed && <Check size={14} className="text-white animate-check" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-base transition-all duration-300 break-words ${
                        task.completed
                          ? 'text-slate-500 line-through'
                          : 'text-slate-100'
                      }`}
                    >
                      {task.text}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${getCategoryColor(task.category)}`}>
                        {categories.find(c => c.value === task.category)?.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-md font-medium bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                        {priorities.find(p => p.value === task.priority)?.label}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes check {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-check { animation: check 0.4s ease-out; }
      `}</style>
    </div>
  );
}

export default App;
