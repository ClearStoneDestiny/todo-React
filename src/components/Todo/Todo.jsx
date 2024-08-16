
import './Todo.css'
import { useEffect, useState } from "react";
import sketchbook from '../../assets/img/sketchbook.png';
import plus from '../../assets/img/plus.png';
import trashcan from '../../assets/img/trashcan1.png';
import pencil from '../../assets/img/pencil.png';


function Todo(){

    const [inputValue, setInputValue] = useState('');
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [editTaskId, setEditTaskId] = useState(null);
    const [message, setMessage] = useState('hideMessage');

    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if(savedTasks){
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    function handleInputChange(e){
        setInputValue(e.target.value)
    }

    function addTask(){
        if(inputValue === ''){
            setMessage('showMessage')
        }
        else if(editTaskId !== null){
            const updatedTask = tasks.map(task => {
                if(task.id === editTaskId){
                    return {...task, text: inputValue}
                }
                return task;
            });
            setTasks(updatedTask);
            setEditTaskId(null);
        }   
        else{
            setTasks([...tasks, {text: inputValue, completed: false, id: Date.now()}]);
        }
        setInputValue('');
        setMessage('hideMessage');
    }

    function deleteAllTasks(){
        setTasks([]);
    }

    function showCompletedTasks(){
        const completedTasks = tasks.filter(task => task.completed === true);
        setFilteredTasks(completedTasks);
    }

    function showUncompletedTasks(){
        const unCompletedTasks = tasks.filter(task => task.completed === false);
        setFilteredTasks(unCompletedTasks);
    }

    function showAllTasks(){
        setFilteredTasks([]);
    }

    function deleteTask(id){
        const taskToDelete = [...tasks.filter(task => task.id !== id)];
        setTasks(taskToDelete);
    }

    function changeTask(id){
        const taskToChange = tasks.find(task => task.id === id);
        if(taskToChange){
            setInputValue(taskToChange.text);
            setEditTaskId(id);
        }
        // console.log(taskToChange.text);
    }

    function toggleTaskCompletion(index){
        const updatedTasks = tasks.map((task) => {
            if(task.id === index){
                return {...task, completed: !task.completed};
            }
            return task;
        });
        setTasks(updatedTasks);
    }

    return  <div className="Container">
                <div className="Todo-header">
                    <h2>ToDo List</h2>
                    <img src={sketchbook} alt="sketchbook" />
                </div>
                <div className="Todo-body">
                    <input 
                            type="text" 
                            className="Todo-input" 
                            placeholder="Add new task" 
                            value={inputValue}
                            onChange={handleInputChange}
                    />
                    <img className="Add-task" src={plus} alt="plus" onClick={addTask}/>
                </div>
                <div className="Buttons">
                    <button onClick={deleteAllTasks}>Delete all</button>
                    <button onClick={showCompletedTasks}>Show completed</button>
                    <button onClick={showUncompletedTasks}>Show uncompleted</button>
                    <button onClick={showAllTasks}>Show all</button>
                </div>
                <h5 className={message}>Please enter task!</h5>
                <ul className="List-items">
                    {(filteredTasks.length > 0 ? filteredTasks : tasks).map((task) => (
                        <li key={task.id}>
                            <div 
                                className={task.completed ? 'Checked' : 'UnChecked'}
                                onClick={() => toggleTaskCompletion(task.id)}
                            >
                                {task.text}
                            </div>   
                            <div className="Todo-images">
                                <img className="Todo-controls" onClick={() => changeTask(task.id)} src={pencil} alt="pencil" />
                                <img className="Todo-controls" onClick={() => deleteTask(task.id)} src={trashcan} alt="trashcan" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
}

export default Todo;