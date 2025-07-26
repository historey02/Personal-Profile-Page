import {useState} from 'react'
import TodoCard from './TodoCard'
import "../css/TodoList.css"
import {useTodoContext} from '../contexts/TodoContext'

function TodoList(){
    const {todos, addTodo} = useTodoContext();
    const {completed} = useTodoContext();
    const {selected, updateSelected} = useTodoContext();
    const [input, setInput] = useState("");
    

     function onAddTodoClick(e){
        e.preventDefault();
        if(input.trim() === "") return;
        
        const newTodo ={
            id: Date.now(),
            todo: input.trim()
        }
        addTodo(newTodo);
        setInput("");
    }


    function onAllClick(e){
        e.preventDefault();
        updateSelected("all");
    }

    function onTodoClick(e){
        e.preventDefault();
        updateSelected("todo")
    }

    function onCompletedClick(e){
        e.preventDefault();
        updateSelected("completed")
    }

    return(
        <div className="todo-list">
            <div className="nav-bar">
                <button className="all-button" onClick={(onAllClick)}>All</button>
                <button className="todo-button" onClick={(onTodoClick)}>Todo</button>
                <button className="completed-button" onClick={(onCompletedClick)} >Completed</button>
            </div>
            {(selected === "all" || selected === "todo") &&
                todos.map((todo) =>(
                (<TodoCard className="todo" key={todo.id} todo={todo}/>)
            ))
            }
            {(selected === "all"|| selected === "completed") && 
            completed.map((completed) =>(
                (<TodoCard className="completed" key={completed.id} todo={completed}/>)
            ))}
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => {
                    if(e.key === "Enter"){
                        onAddTodoClick(e);
                    }
                }} placeholder="Enter a TODO"/>
            <button className="add-button" type="button" onClick={(onAddTodoClick)}>Enter</button>
        </div>
    );
}

export default TodoList;