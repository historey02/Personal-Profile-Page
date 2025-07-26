import { useState } from 'react'
import TodoCard from './components/TodoCard'
import TodoList from './components/TodoList'
import './css/App.css'
import { TodoProvider } from './contexts/TodoContext'

function App() {
  
  return(
    <TodoProvider>
      <div className="app-container">
        <TodoList />
      </div>
    </TodoProvider>
    
  );
}

export default App
