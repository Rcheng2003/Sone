import React from 'react';
import { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';
import './Todo.css';
//API
const api_base = 'http://localhost:3001/api/todos';

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 400,
      height: 300,
      position: { x: 400, y: 100 },
      isBoxOpen: true,
      todos: [],
      popupActive: false,
      newTodo: ""
    };
  }

  componentDidMount() {
    this.GetTodos();
    const divElements = document.querySelectorAll('.todo:not(.is-complete) .text');
    divElements.forEach((element) => {
      element.contentEditable = true;
    });
  }

  GetTodos() {
  fetch(api_base + '/userTodos', {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => this.setState({ todos: data }))
    .catch((err) => console.error("Error: ", err));
  }

  completeTodo = async (id) => {
    const data = await fetch(api_base + '/complete/' + id, {
      credentials: 'include',
   }).then(res => res.json());

    this.setState((prevState) => ({
      todos: prevState.todos.map(todo => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    }));
  }

  addTodo = async () => {
    const data = await fetch(api_base + "/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({
        text: this.state.newTodo
      })
    }).then(res => res.json());

    this.setState((prevState) => ({
      todos: [...prevState.todos, data],
      popupActive: false,
      newTodo: ""
    }));
  }

  deleteTodo = async (id) => {
    const data = await fetch(api_base + '/delete/' + id, { method: "DELETE", credentials: 'include',
  }).then(res => res.json());

    this.setState((prevState) => ({
      todos: prevState.todos.filter(todo => todo._id !== data._id)
    }));
  }

  handleResize = (e, { size }) => {
    this.setState({
      width: size.width,
      height: size.height,
    });
  };

  handleDrag = (e, ui) => {
    const { x, y} = this.state.position;
    const { width, height } = this.state;
    const innerWidth = document.documentElement.clientWidth-100;
    const innerHeight = document.documentElement.clientHeight-100;
    const newPosition = {
      x: x + ui.deltaX,
      y: y + ui.deltaY
    };
    
    this.setState({
      position: newPosition
    });

    if (
      newPosition.x - width - 500 < -innerWidth ||
      newPosition.x > innerWidth ||
      newPosition.y - height - 280 < -innerHeight ||
      newPosition.y > innerHeight
    ) {
      this.handleClose();
    }
  };

  handleClose = () => {
    const {onClose} = this.props;
    if (onClose){
        onClose();
    }
  };

  render() {
    const { width, height, position} = this.state;
    const { todos, popupActive, newTodo } = this.state;

    return (
        <Draggable
            position={position}
            onDrag={this.handleDrag}
            handle=".handle"
        >
                <div
            style={{
            width: width,
            height: height,
            transform: `translate(${position.x}px, ${position.y}px)`
            }}
            className="resizable-box"
        >
            <Resizable
            width={width}
            height={height}
            onResize={this.handleResize}
            minConstraints={[300,200]}
            maxConstraints={[1000,1000]}
            >
            <div className="box">
                <div className="handle">
                    <div className="handle-content">Tasks</div>
                    <button className="close-button" onClick={this.handleClose}>
                        -
                    </button>
                </div>

                <div className="content">
                    <div style={{ width: `${width}px` }} className='todos'>
                        {todos.length > 0 ? todos.map(todo => (
                            <div className={
                                "todo" + (todo.complete ? " is-complete" : "")
                            }>
                                <div className="checkbox" key={todo._id} onClick={() => this.completeTodo(todo._id)}></div>

                                <div className="text"
                                contentEditable={todo.complete ? "false" : "true"}>
                                    {todo.text}
                                </div>

                                <div className="delete-todo" onClick={() => this.deleteTodo(todo._id)}></div>
                            </div>
                        )) : (
                            <p>You currently have no tasks</p>
                        )}
                    </div>

                    <div className="addPopup" onClick={() => this.setState({ popupActive: true })}>+</div>

                    {popupActive ? (
                        <div className="popup">
                            <div className="closePopup" onClick={() => this.setState({ popupActive: false })}>X</div>
                            <div className="content">
                                <h3>Add Task</h3>
                                <input type="text" className="add-todo-input" onChange={e => this.setState({ newTodo: e.target.value })} value={newTodo} />
                                <div className="button" onClick={this.addTodo}>Create Task</div>
                            </div>
                        </div>
                    ) : ''}

                </div>
            </div>
            </Resizable>
        </div>
        </Draggable>
    );
  }
}

export default Todo;
