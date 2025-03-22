import React, { useState } from "react";
import "../styles/Todo.css";

const TodoCalendar = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [tasks, setTasks] = useState({});
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // Geçerli ay

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const selectDate = (month, day) => {
        const key = `${year}-${month + 1}-${day}`;
        setSelectedDate(key);
        if (!tasks[key]) {
            setTasks({ ...tasks, [key]: { pending: [], completed: [] } });
        }
    };

    const addTask = () => {
        const newTask = prompt("Enter task:");
        if (newTask && selectedDate) {
            setTasks({
                ...tasks,
                [selectedDate]: {
                    ...tasks[selectedDate],
                    pending: [...tasks[selectedDate].pending, newTask]
                }
            });
        }
    };

    const moveTask = (task, from, to) => {
        setTasks({
            ...tasks,
            [selectedDate]: {
                pending: tasks[selectedDate].pending.filter(t => t !== task),
                completed: from === "pending" ? [...tasks[selectedDate].completed, task] : tasks[selectedDate].completed.filter(t => t !== task)
            }
        });
    };

    const renderMonth = (monthIndex) => {
        const days = daysInMonth(monthIndex, year);
        const firstDay = getFirstDayOfMonth(monthIndex, year);
        const weeks = [];
        let dayCounter = 1;

        // İlk haftayı oluştur (boş günlerle başlar)
        let week = [];
        for (let i = 0; i < firstDay; i++) {
            week.push(<div key={`empty-${i}`} className="day empty"></div>);
        }
        for (let i = firstDay; i < 7; i++) {
            const currentDay = dayCounter;
            const isSelected = selectedDate === `${year}-${monthIndex + 1}-${currentDay}`;
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
        weeks.push(<div key={`week-${weeks.length}`} className="week">{week}</div>);

        // Kalan haftaları oluştur
        while (dayCounter <= days) {
            week = [];
            for (let i = 0; i < 7 && dayCounter <= days; i++) {
                const currentDay = dayCounter;
                const isSelected = selectedDate === `${year}-${monthIndex + 1}-${currentDay}`;
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
            weeks.push(<div key={`week-${weeks.length}`} className="week">{week}</div>);
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
                        <div key={index} className="day-name">{day}</div>
                    ))}
                </div>
                <div className="weeks">
                    {renderMonth(currentMonthIndex)}
                </div>
            </div>
            {selectedDate && (
                <div className="task-manager">
                    <h3>Tasks for {selectedDate}</h3>
                    <button onClick={addTask}>Add Task</button>
                    <div className="task-lists">
                        <div>
                            <h4>Pending</h4>
                            {tasks[selectedDate]?.pending.map((task, index) => (
                                <div key={index} className="task">
                                    {task} <button onClick={() => moveTask(task, "pending", "completed")}>&#8594;</button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4>Completed</h4>
                            {tasks[selectedDate]?.completed.map((task, index) => (
                                <div key={index} className="task completed">
                                    {task} <button onClick={() => moveTask(task, "completed", "pending")}>&#8592;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoCalendar;