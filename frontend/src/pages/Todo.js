import React, { useState, useEffect } from "react";
import "../styles/Todo.css";

const TodoCalendar = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]); // Always initialize as empty array
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Fetch tasks when a date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchTasks(selectedDate);
    } else {
      setTasks([]); // Reset tasks when no date is selected
    }
  }, [selectedDate]);

  const fetchTasks = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tasks?date=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array; fallback to empty array if not
        setTasks(Array.isArray(data) ? data : []);
      } else {
        console.error(
          `Failed to fetch tasks: ${response.status} ${response.statusText}`
        );
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setTasks([]);
    }
  };

  const selectDate = (month, day) => {
    const key = `${year}-${month + 1}-${day}`;
    setSelectedDate(key);
  };

  const addTask = async () => {
    const newTask = prompt("Enter task:");
    if (newTask && selectedDate) {
      try {
        const response = await fetch("http://localhost:8080/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: selectedDate,
            description: newTask,
            status: "pending",
          }),
        });
        if (response.ok) {
          const createdTask = await response.json();
          setTasks((prevTasks) => [...prevTasks, createdTask]);
        } else {
          console.error(
            `Failed to add task: ${response.status} ${response.statusText}`
          );
          alert("Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task:", error.message);
        alert("An error occurred while adding the task");
      }
    }
  };

  const moveTask = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const response = await fetch(
        `http://localhost:8080/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: task.date,
            description: task.description,
            status: newStatus,
          }),
        }
      );
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
      } else {
        console.error(
          `Failed to update task: ${response.status} ${response.statusText}`
        );
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error.message);
      alert("An error occurred while updating the task");
    }
  };

  const renderMonth = (monthIndex) => {
    const days = daysInMonth(monthIndex, year);
    const firstDay = getFirstDayOfMonth(monthIndex, year);
    const weeks = [];
    let dayCounter = 1;

    let week = [];
    for (let i = 0; i < firstDay; i++) {
      week.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    for (let i = firstDay; i < 7; i++) {
      const currentDay = dayCounter;
      const isSelected =
        selectedDate === `${year}-${monthIndex + 1}-${currentDay}`;
      week.push(
        <button
          key={currentDay}
          className={`day ${isSelected ? "selected" : ""}`}
          onClick={() => selectDate(monthIndex, currentDay)}
        >
          {currentDay}
        </button>
      );
      dayCounter++;
    }
    weeks.push(
      <div key={`week-${weeks.length}`} className="week">
        {week}
      </div>
    );

    while (dayCounter <= days) {
      week = [];
      for (let i = 0; i < 7 && dayCounter <= days; i++) {
        const currentDay = dayCounter;
        const isSelected =
          selectedDate === `${year}-${monthIndex + 1}-${currentDay}`;
        week.push(
          <button
            key={currentDay}
            className={`day ${isSelected ? "selected" : ""}`}
            onClick={() => selectDate(monthIndex, currentDay)}
          >
            {currentDay}
          </button>
        );
        dayCounter++;
      }
      weeks.push(
        <div key={`week-${weeks.length}`} className="week">
          {week}
        </div>
      );
    }

    return weeks;
  };

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className="todo-calendar">
      <div className="year-selector">
        <button onClick={() => setYear(year - 1)}>&lt;</button>
        <span>{year}</span>
        <button onClick={() => setYear(year + 1)}>&gt;</button>
      </div>
      <div className="calendar">
        <div className="month-navigation">
          <button onClick={handlePrevMonth}>&lt;</button>
          <h3>{months[currentMonthIndex]}</h3>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
        <div className="days-of-week">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="day-name">
              {day}
            </div>
          ))}
        </div>
        <div className="weeks">{renderMonth(currentMonthIndex)}</div>
      </div>
      {selectedDate && (
        <div className="task-manager">
          <h3>Tasks for {selectedDate}</h3>
          <button onClick={addTask}>Add Task</button>
          <div className="task-lists">
            <div>
              <h4>Pending</h4>
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks
                  .filter((task) => task.status === "pending")
                  .map((task) => (
                    <div key={task.id} className="task">
                      {task.description}{" "}
                      <button onClick={() => moveTask(task)}>→</button>
                    </div>
                  ))
              ) : (
                <p>No pending tasks</p>
              )}
            </div>
            <div>
              <h4>Completed</h4>
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks
                  .filter((task) => task.status === "completed")
                  .map((task) => (
                    <div key={task.id} className="task completed">
                      {task.description}{" "}
                      <button onClick={() => moveTask(task)}>←</button>
                    </div>
                  ))
              ) : (
                <p>No completed tasks</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCalendar;
