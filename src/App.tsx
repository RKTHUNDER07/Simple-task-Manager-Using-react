import { useState, useReducer, useRef, useEffect } from "react";

import "./App.css";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface State {
  tasks: Task[];
}

type Action =
  | { type: "ADD_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: number }
  | { type: "REMOVE_TASK"; payload: number };

const initialState: State = {
  tasks: [],
};

function tasksReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: Date.now(),
            title: action.payload,
            completed: false,
          },
        ],
      };
    // break;
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case "REMOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id != action.payload),
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const [taskTitle, setTaskTitle] = useState("");

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    dispatch({ type: "ADD_TASK", payload: taskTitle });
    setTaskTitle("");
  };

  const inputFocus = useRef(null);

  useEffect(() => {
    inputFocus.current.focus();
  }, []);

  return (
    <>
      <div>
        <h2>Task Manager</h2>
        <input
          type="text"
          ref={inputFocus}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
        <ul>
          {state.tasks.map((task) => (
            <li
              key={task.id}
              onClick={() => {
                dispatch({ type: "TOGGLE_TASK", payload: task.id });
              }}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
              <button
                style={{
                  marginLeft: "20px",
                }}
                onClick={() => {
                  dispatch({ type: "REMOVE_TASK", payload: task.id });
                }}
              >
                -
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
