import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiHeart } from "react-icons/fi";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [newTask, setNewTask] = useState("");
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [error, setError] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await axios.get("http://localhost:3000/tasks");
        setTodoTasks(res.data.filter((t) => t.status === "todo"));
        setInProgressTasks(res.data.filter((t) => t.status === "inprogress"));
        setDoneTasks(res.data.filter((t) => t.status === "done"));
      } catch (err) {
        setError("Failed to load tasks from server");
      }
    }
    fetchTasks();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("login");
      navigate("/Login", { replace: true });
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      setError("Task is empty!");
      return;
    }
    setError("");
    try {
      const res = await axios.post("http://localhost:3000/tasks", {
        name: newTask,
        status: "todo",
      });
      setTodoTasks([...todoTasks, res.data]);
      setNewTask("");
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);

      if (type === "todo")
        setTodoTasks(todoTasks.filter((task) => task._id !== id));
      else if (type === "inprogress")
        setInProgressTasks(inProgressTasks.filter((task) => task._id !== id));
      else if (type === "done")
        setDoneTasks(doneTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleDragStart = (task, from) => {
    setDraggedTask(task);
    setDraggedFrom(from);
  };

  const handleDrop = async (toColumn) => {
    if (!draggedTask || draggedFrom === toColumn) return;

    try {
      await axios.put(`http://localhost:3000/tasks/${draggedTask._id}`, {
        status: toColumn,
      });

      if (draggedFrom === "todo") {
        setTodoTasks(todoTasks.filter((task) => task._id !== draggedTask._id));
      } else if (draggedFrom === "inprogress") {
        setInProgressTasks(
          inProgressTasks.filter((task) => task._id !== draggedTask._id)
        );
      } else if (draggedFrom === "done") {
        setDoneTasks(doneTasks.filter((task) => task._id !== draggedTask._id));
      }

      if (toColumn === "todo") {
        setTodoTasks([...todoTasks, { ...draggedTask, status: "todo" }]);
      } else if (toColumn === "inprogress") {
        setInProgressTasks([
          ...inProgressTasks,
          { ...draggedTask, status: "inprogress" },
        ]);
      } else if (toColumn === "done") {
        setDoneTasks([...doneTasks, { ...draggedTask, status: "done" }]);
      }

      setDraggedTask(null);
      setDraggedFrom("");
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-black/80 text-white z-50 shadow-md">
        <div className="flex items-center gap-3">
          <FiHeart size={24} className="text-pink-500" />
          <span className="text-lg font-semibold hidden md:block">
            Kanban Task Board
          </span>
        </div>
        <p className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold">
          Dashboard
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="p-2 rounded hover:bg-red-700 transition"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </header>

      <main className="pt-24 px-4 flex flex-col items-center min-h-[calc(100vh-5rem)]">
        <h1 className="text-lg md:text-3xl font-bold mb-5 text-gray-800">
          Welcome to your Kanban Task Board!
        </h1>

        <div className="w-full max-w-sm mb-6 flex items-center gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm -mt-5 -ml-8 mb-5">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
          <div
            className="bg-white rounded-lg shadow p-4"
            onDragOver={allowDrop}
            onDrop={() => handleDrop("todo")}
          >
            <h2 className="text-xl underline font-semibold mb-4 text-center text-gray-800">
              To Do
            </h2>
            {todoTasks.length === 0 ? (
              <p className="text-gray-400 text-center">No tasks</p>
            ) : (
              todoTasks.map((task) => (
                <div
                  key={task._id}
                  draggable
                  onDragStart={() => handleDragStart(task, "todo")}
                  className="p-2 mb-2 flex justify-between items-center bg-gray-200 rounded shadow cursor-move"
                >
                  <span>{task.name}</span>
                  <span
                    onClick={() => handleDelete(task._id, "todo")}
                    className="cursor-pointer"
                  >
                    ❌
                  </span>
                </div>
              ))
            )}
          </div>

          <div
            className="bg-white rounded-lg shadow p-4"
            onDragOver={allowDrop}
            onDrop={() => handleDrop("inprogress")}
          >
            <h2 className="text-xl underline font-semibold mb-4 text-center text-yellow-700">
              In Progress
            </h2>
            {inProgressTasks.length === 0 ? (
              <p className="text-gray-400 text-center">No tasks</p>
            ) : (
              inProgressTasks.map((task) => (
                <div
                  key={task._id}
                  draggable
                  onDragStart={() => handleDragStart(task, "inprogress")}
                  className="p-2 mb-2 flex justify-between items-center bg-yellow-100 rounded shadow cursor-move"
                >
                  <span>{task.name}</span>
                  <span
                    onClick={() => handleDelete(task._id, "inprogress")}
                    className="cursor-pointer"
                  >
                    ❌
                  </span>
                </div>
              ))
            )}
          </div>

          <div
            className="bg-white rounded-lg shadow p-4"
            onDragOver={allowDrop}
            onDrop={() => handleDrop("done")}
          >
            <h2 className="text-xl underline font-semibold mb-4 text-center text-green-700">
              Done
            </h2>
            {doneTasks.length === 0 ? (
              <p className="text-gray-400 text-center">No tasks</p>
            ) : (
              doneTasks.map((task) => (
                <div
                  key={task._id}
                  draggable
                  onDragStart={() => handleDragStart(task, "done")}
                  className="p-2 mb-2 flex justify-between items-center bg-green-100 rounded shadow cursor-move"
                >
                  <span>{task.name}</span>
                  <span
                    onClick={() => handleDelete(task._id, "done")}
                    className="cursor-pointer"
                  >
                    ❌
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
