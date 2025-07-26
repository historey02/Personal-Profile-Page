import '../css/TodoCard.css'
import {useTodoContext} from '../contexts/TodoContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faCheck} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'


function TodoCard({todo, className}){
    const {completed, addTodo, removeTodo, addCompleted, removeCompleted, updateTodo} = useTodoContext();
    const[isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(todo.todo);

    function handleEditSubmit(){
        if(editValue.trim() !== ""){
            updateTodo(todo.id, editValue.trim());
            setIsEditing(false);
        }
    }

    function onDeleteClick(e){
        e.preventDefault();
        removeTodo(todo.id);
        removeCompleted(todo.id);
    }

    function handleStatusClick(e){
        e.preventDefault();
        //Checks if task is already in completed. If it is, that todo is added to Todos and removed from completed
        if(completed.some(obj => obj.id === todo.id )){
            removeCompleted(todo.id);
            addTodo(todo);
            console.log("Removed from completed, added to todos")
        }
        //if the todo is not in completed, then adds it to completed and removes it from todos
        else{
            addCompleted(todo);
            removeTodo(todo.id);
            console.log("Romoved from todos, added to completed")
        }
    }

    return(
        <div className={`todo-card ${className}`}>
            <button className="status-button" onClick={(handleStatusClick)}>
                <FontAwesomeIcon className="check-icon" icon={faCheck}/>
            </button>

            {isEditing ? (
                <input 
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) =>{
                        if(e.key === "Enter"){
                            handleEditSubmit();
                        }
                    }}
                    onBlur={handleEditSubmit}
                    autoFocus
                    />) : (
                        <h2 
                            className="todo-name"
                            onClick={() => setIsEditing(true)}
                            title="Click to edit">{todo.todo}</h2>
                    )
            }
            <button className="delete-button" onClick={(onDeleteClick)}>
                <FontAwesomeIcon className="trash-icon" icon={faTrashCan}/>
            </button>
        </div>
    );
}

export default TodoCard;