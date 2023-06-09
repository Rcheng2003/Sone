import React, { useState } from 'react';
import Todo from './components/To-Do/Todo';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
    /*
    const [showTodo, setShowTodo] = useState(false);
    
    const SetVisibleTodo = () => {
        setShowTodo(true);
    };

    const handleClose = () => {
        setShowTodo(false);
    };*/

	return (
        /*
            <h1> Just a Test </h1>
            <button onClick = {SetVisibleTodo}> To Do Button </button>
            {showTodo && <Todo onClose={handleClose}/>}*/
		<div className="App">
            <Sidebar></Sidebar>
		</div>
	);
}

export default App;
