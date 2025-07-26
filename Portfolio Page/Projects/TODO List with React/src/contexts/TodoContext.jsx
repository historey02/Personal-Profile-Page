import {createContext, useState, useContext, useEffect} from 'react'

const TodoContext = createContext();

export const useTodoContext = () => useContext(TodoContext);

export const TodoProvider =({children}) => {
    const [todos, setTodos] = useState(() =>{
        const stored = localStorage.getItem("todos");
        return stored ? JSON.parse(stored) : [];
    });

    const [completed, setCompleted] = useState(() =>{
        const stored = localStorage.getItem("completed");
        return stored ? JSON.parse(stored) : [];
    })

    const [selected, setSelected] = useState(() =>{
        const stored = localStorage.getItem('selected');
        return stored ? JSON.parse(stored) : "all";
    })

    useEffect(() =>{
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos]);

    useEffect(() =>{
        localStorage.setItem('completed', JSON.stringify(completed))
    }, [completed]);

    useEffect(() =>{
        localStorage.setItem('selected', JSON.stringify(selected))
    }, [selected])

    function addTodo(todo){
        setTodos(prev => [...prev, todo]);
    }

    function removeTodo(todoId){
        setTodos(prev => prev.filter(todo => todo.id !== Number(todoId)));
    }

    function addCompleted(todo){
        setCompleted(prev => [...prev, todo]);
    }

    function removeCompleted(todoId){
        setCompleted(prev => prev.filter(todo => todo.id !== Number(todoId)));
    }

    function updateSelected(update){
        setSelected(update);
    }

    function updateTodo(id, newValue){
        setTodos(prev => prev.map(todo =>{
            return todo.id === id ? {...todo, todo: newValue} : todo
        }));
        setCompleted(prev => prev.map(todo =>{
            return todo.id === id ? {...todo, todo: newValue} : todo
        }));
    }

    const value = {
        todos,
        completed,
        selected,
        updateSelected,
        addTodo,
        removeTodo,
        addCompleted,
        removeCompleted,
        updateTodo
    }

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    )
}