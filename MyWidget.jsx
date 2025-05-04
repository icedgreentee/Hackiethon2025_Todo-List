import React, { useState } from 'react'; //DONT TOUCH THIS AT ALL 

// Import css file
import './StyleWidget.css'

// Import images from the assets folder
import pink_FaceLeft from '../assets/pink_faceLeft.png';
import pink_FaceRight from '../assets/pink_faceRight.png';
import blue_FaceLeft from '../assets/blue_faceLeft.png';
import blue_FaceRight from '../assets/blue_faceRight.png';
import green_FaceLeft from '../assets/green_faceLeft.png';
import green_FaceRight from '../assets/green_faceRight.png';


////////////////////////////<-----------------JavaScript here----------------->////////////////////////////

const MyWidget = () => {
    // State to hold tasks, each task has id, text, dueDate, attachment, editing state, and completion status
    const [tasks, setTasks] = useState([
        //{ id: 1, text: 'Task 1', dueDate: '2025-03-30', attachment: '', isEditing: false, completed: false },
    ]);
    
    // State for new task input fields (text, dueDate, attachment)
    const [newTask, setNewTask] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newAttachment, setNewAttachment] = useState('');
    
    // State for theme selection (pinks, blues, or greens)
    const [theme, setTheme] = useState('pinks');

    // Function to format date to 'dd/mm/yyyy'
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Function to add a new task
    const addTask = () => {
        if (newTask.trim() && newDueDate) {
            setTasks([...tasks, { id: Date.now(), text: newTask, dueDate: newDueDate, attachment: newAttachment, isEditing: false, completed: false }]);
            setNewTask('');
            setNewDueDate('');
            setNewAttachment('');
        }
    };

    // Function to delete a task by its id
    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Function to toggle edit mode for a task
    const toggleEdit = (id) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, isEditing: !task.isEditing } : task)));
    };

    // Function to save task edits
    const editTask = (id, newText, newDueDate) => {
        setTasks(tasks.map((task) =>
            task.id === id ? { ...task, text: newText, dueDate: newDueDate, isEditing: false } : task
        ));
    };

    // Function to toggle the completion state of a task
    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    // Calculate the percentage of completed tasks for the progress bar
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Function to change the theme of the widget
    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    // Function to render theme switching buttons based on the current theme
    const getThemeButtons = () => {
        switch (theme) {
            case 'pinks':
                return (
                    <>
                        <button onClick={() => changeTheme('blues')}>
                            <img src={blue_FaceLeft} alt="blue theme" />
                        </button>
                        <button onClick={() => changeTheme('greens')}>
                            <img src={green_FaceRight} alt="green theme" />
                        </button>
                    </>
                );
            case 'blues':
                return (
                    <>
                        <button onClick={() => changeTheme('pinks')}>
                            <img src={pink_FaceLeft} alt="pink theme" />
                        </button>
                        <button onClick={() => changeTheme('greens')}>
                            <img src={green_FaceRight} alt="green theme" />
                        </button>
                    </>
                );
            case 'greens':
                return (
                    <>
                        <button onClick={() => changeTheme('blues')}>
                            <img src={blue_FaceLeft} alt="blue theme" />
                        </button>
                        <button onClick={() => changeTheme('pinks')}>
                            <img src={pink_FaceRight} alt="pink theme" />
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    // Handle changes in the attachment input field
    const handleAttachmentChange = (e) => {
        setNewAttachment(e.target.value);
    };

    // Function to check if a task is overdue
    const isTaskOverdue = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time 
        const taskDueDate = new Date(dueDate);
        taskDueDate.setHours(0, 0, 0, 0); // Reset time 
        return taskDueDate < today; //overdue doesn't show on current date anymore!!
    };

    /////////////////////////////<-----------------HTML here----------------->////////////////////////////   

    return (
        <div className={`todo-container ${theme}`}>
            {/* Theme Switcher Buttons */}
            <div className="theme-switcher">{getThemeButtons()}</div>

            <h1>To-Do List</h1>

            {/* Input fields for new task */}
            <div className="todo-input">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                />
                <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                />
                <input
                    type="text"
                    value={newAttachment}
                    onChange={handleAttachmentChange}
                    placeholder="Paste URL here"
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            {/* Task List */}
            <ul className="todo-list">
                {tasks.map((task) => {
                    const overdue = isTaskOverdue(task.dueDate);
                    return (
                        <li key={task.id} className="todo-item">
                            <input
                                type="checkbox"
                                checked={task.completed || false}
                                onChange={() => toggleTaskCompletion(task.id)}
                            />

                            {task.isEditing ? (
                                <>
                                    {/* Edit Task Inputs */}
                                    <input
                                        type="text"
                                        value={task.text}
                                        onChange={(e) => editTask(task.id, e.target.value, task.dueDate)}
                                        autoFocus
                                    />
                                    <input
                                        type="date"
                                        value={task.dueDate}
                                        onChange={(e) => editTask(task.id, task.text, e.target.value)}
                                    />
                                </>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                                    <span style={{ textAlign: 'left' }}>{task.text}</span>
                                    <span style={{ textAlign: 'left' }}>{formatDate(task.dueDate)}</span>
                                    {overdue && <span style={{ textAlign: 'left', color: 'red' }}>Overdue!</span>}
                                    {task.attachment && (
                                        <div style={{ textAlign: 'left' }}>
                                            <a href={task.attachment} target="_blank" rel="noopener noreferrer">
                                                URL
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button className="edit-btn" onClick={() => toggleEdit(task.id)}>
                                {task.isEditing ? 'Save' : 'Edit'}
                            </button>

                            <button onClick={() => deleteTask(task.id)} className="delete-btn">
                                Delete
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Progress Bar to show task completion percentage */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default MyWidget; // DONT TOUCH THIS AT ALL //

//All aligned 
