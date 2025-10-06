import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiHeart } from "react-icons/fi";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [showAddTaskInputs, setShowAddTaskInputs] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [error, setError] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await axios.get("http://localhost:3000/tasks", axiosConfig);
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
      localStorage.removeItem("token");
      navigate("/Login", { replace: true });
    }
  };

  const handleAddTaskClick = () => {
    setShowAddTaskInputs(true);
    setError("");
  };

  const handleAddTaskSubmit = async () => {
    if (newTaskName.trim() === "") {
      setError("Task name is required!");
      return;
    }
    if (newTaskDescription.trim() === "") {
      setError("Task description is required!");
      return;
    }

    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3000/tasks",
        {
          name: newTaskName,
          description: newTaskDescription,
          status: "todo",
        },
        axiosConfig
      );
      setTodoTasks([...todoTasks, res.data]);
      setNewTaskName("");
      setNewTaskDescription("");
      setShowAddTaskInputs(false);

      setMessage("Task added successfully!");
      setMessageType("success");

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError("Failed to add task");

      setMessage("Failed to add task.");
      setMessageType("error");

      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`, axiosConfig);

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
      await axios.put(
        `http://localhost:3000/tasks/${draggedTask._id}`,
        { status: toColumn },
        axiosConfig
      );

      if (draggedFrom === "todo") {
        setTodoTasks(todoTasks.filter((task) => task._id !== draggedTask._id));
      } else if (draggedFrom === "inprogress") {
        setInProgressTasks(
          inProgressTasks.filter((task) => task._id !== draggedTask._id)
        );
      } else if (draggedFrom === "done") {
        setDoneTasks(doneTasks.filter((task) => task._id !== draggedTask._id));
      }

      const updatedTask = { ...draggedTask, status: toColumn };
      if (toColumn === "todo") {
        setTodoTasks([...todoTasks, updatedTask]);
      } else if (toColumn === "inprogress") {
        setInProgressTasks([...inProgressTasks, updatedTask]);
      } else if (toColumn === "done") {
        setDoneTasks([...doneTasks, updatedTask]);
      }

      setDraggedTask(null);
      setDraggedFrom("");
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const renderTasks = (tasks, setTasks, type, bgColor, textColor) => {
    return tasks.length === 0 ? (
      <p className="text-gray-400 text-center">No tasks</p>
    ) : (
      tasks.map((task) => (
        <div
          key={task._id}
          draggable={editingTaskId !== task._id}
          onDragStart={() => handleDragStart(task, type)}
          className={`${bgColor} p-3 mb-3 rounded shadow cursor-move relative`}
        >
          <div
            className={`-mt-3 mb-3 py-0.5 text-xs font-semibold rounded-bl-md ${
              task.status === "todo"
                ? " text-black text-bold"
                : task.status === "inprogress"
                ? " text-black"
                : " text-black"
            }`}
          >
            {task.status === "todo"
              ? "To Do"
              : task.status === "inprogress"
              ? "In Progress"
              : "Done"}
          </div>

          <div className="flex justify-between items-start">
            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="p-1 rounded border w-40"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="p-1 rounded border resize-none w-60"
                  rows={2}
                />
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => {
                      if (editName.trim() === "") {
                        setError("Task name cannot be empty.");
                        return;
                      }
                      setTasks((prevTasks) =>
                        prevTasks.map((t) =>
                          t._id === task._id
                            ? {
                                ...t,
                                name: editName,
                                description: editDescription,
                              }
                            : t
                        )
                      );
                      setEditingTaskId(null);
                      setError("");
                    }}
                    className={`text-green-600 hover:text-green-800`}
                    title="Save"
                  >
                    💾
                  </button>
                  <button
                    onClick={() => {
                      setEditingTaskId(null);
                      setError("");
                    }}
                    className={`text-red-600 hover:text-red-800`}
                    title="Cancel"
                  >
                    ❌
                  </button>
                </div>
              </>
            ) : (
              <>
                <p
                  onClick={() => handleTaskClick(task)}
                  className="font-semibold flex-1 cursor-pointer"
                >
                  {task.name}
                </p>
                <div className="flex gap-2 ml-2">
                  <span
                    onClick={() => {
                      setEditingTaskId(task._id);
                      setEditName(task.name);
                      setEditDescription(task.description || "");
                    }}
                    className={`cursor-pointer ${textColor} hover:opacity-70`}
                    title="Edit Task"
                  >
                    ✏️
                  </span>
                  <span
                    onClick={() => handleDelete(task._id, type)}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    title="Delete Task"
                  >
                    ❌
                  </span>
                </div>
              </>
            )}
          </div>
          {editingTaskId !== task._id && task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
      ))
    );
  };

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

      <main className="pt-24 px-4 flex flex-col items-center w-full">
        <h1 className="text-lg md:text-3xl font-bold mb-3 text-gray-800">
          Welcome to your Kanban Task Board!
        </h1>
        {message && (
          <div
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 ${
              messageType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message}
          </div>
        )}
        {!showAddTaskInputs && (
          <button
            onClick={handleAddTaskClick}
            className="mb-5 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Task
          </button>
        )}

        {showAddTaskInputs && (
          <div className="mb-5 w-full max-w-md flex flex-col gap-3">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Task name"
              className="p-2 border rounded"
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task description"
              className="p-2 border rounded resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddTaskSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTaskInputs(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-5">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full mx-auto">
          <div
            className="bg-white rounded-lg shadow p-4"
            onDragOver={allowDrop}
            onDrop={() => handleDrop("todo")}
          >
            <h2 className="text-xl underline font-semibold mb-4 text-center text-gray-800">
              To Do
            </h2>
            {renderTasks(
              todoTasks,
              setTodoTasks,
              "todo",
              "bg-gray-200",
              "text-blue-600"
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
            {renderTasks(
              inProgressTasks,
              setInProgressTasks,
              "inprogress",
              "bg-yellow-100",
              "text-yellow-700"
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
            {renderTasks(
              doneTasks,
              setDoneTasks,
              "done",
              "bg-green-100",
              "text-green-700"
            )}
          </div>

          {showTaskModal && selectedTask && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-none p-6 relative flex flex-col">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
                >
                  ❌
                </button>
                <h2 className="text-4xl font-bold mb-6 mt-10 text-center">
                  {selectedTask.name}
                </h2>
                <div className="flex-grow overflow-auto">
                  <p className="text-gray-700 text-center whitespace-pre-line text-2xl">
                    {selectedTask.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
