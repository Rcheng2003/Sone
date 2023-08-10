import React from 'react';
import { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import './Todo.css';
//API
const api_base = 'http://localhost:3001/api/todos';
const api_base2 = 'http://localhost:3001/api/event';

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
      popupActive2: false,
      newTodo: "",
      newEvent: "",
      selectedDateS: new Date(),
      selectedTimeS: '00:00',
      selectedDateE: new Date(),
      selectedTimeE: '00:00'
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

  updateTodo = async (id, newText) => {
    const response = await fetch(api_base + '/update/' + id, {
      method: "PUT",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: newText })
    });
  
    if (response.ok) {
      const updatedTodo = await response.json();
      this.setState((prevState) => ({
        todos: prevState.todos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo))
      }));
    } else {
      // Handle error if the request fails
      console.error("Failed to update the Todo item.");
    }
  }

  addEvent = async () => {
    const formattedStartDate = this.state.selectedDateS.toISOString().split('T')[0];
    const formattedEndDate = this.state.selectedDateE.toISOString().split('T')[0];
    const eventData = {
      title: this.state.newEvent,
      start: formattedStartDate + 'T' + this.state.selectedTimeS + ':00',
      end: formattedEndDate + 'T' + this.state.selectedTimeE + ':00',
    };

    /*
    const eventData = {
      title: "Walk tahep dog",
      start: "2023-07-31T10:00:00",
      end: "2023-07-31T11:00:00"
    }*/

    const data = await fetch(api_base2 + "/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(eventData)
    }).then(res => res.json());

    this.setState(() => ({
      popupActive2: false,
      newEvent: "",
      selectedDateS: new Date(),
      selectedTimeS: '00:00',
      selectedDateE: new Date(),
      selectedTimeE: '00:00'
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
  };

  handleClose = () => {
    const {onClose} = this.props;
    if (onClose){
        onClose();
    }
  };

  handleDateChangeS = (date) => {
    this.setState({
      selectedDateS: date
    })
  }

  handleTimeChangeS = (time) => {
    this.setState({
      selectedTimeS: time
    })
  }

  handleDateChangeE = (date) => {
    this.setState({
      selectedDateE: date
    })
  }

  handleTimeChangeE = (time) => {
    this.setState({
      selectedTimeE: time
    })
  }

  render() {
    const { width, height, position} = this.state;
    const { todos, popupActive, popupActive2, newTodo } = this.state;

    return (
      <div>
        <Draggable
            position={position}
            onDrag={this.handleDrag}
            handle=".TodoHandle"
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
                <div className="TodoHandle">
                    <div className="TodoHandle-content">Tasks</div>
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

                                <div
                                  className="text"
                                  contentEditable={todo.complete ? "false" : "true"}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                      event.preventDefault(); // Prevent new line insertion
                                      this.updateTodo(todo._id, event.target.textContent);
                                    }
                                  }}
                                >
                                    {todo.text}

                                </div>

                                <div className="addEvent" onClick={() => this.setState({popupActive2: true, newEvent: todo.text})}>E</div>
                                
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
        {popupActive2 ? (
          <div className='popup2'>
            <div className="closePopup2" onClick={() => this.setState({ popupActive2: false })}>X</div>
            <h2 className='popup2Title'>Select Date and Time</h2>
            <div>
              <h3 className='popup2Date'>Date:</h3>
              <DatePicker
                selected={this.state.selectedDateS}
                onChange={this.handleDateChangeS}
                dateFormat="yyyy-MM-dd"
              />
              <span className='between'>to</span>
              <DatePicker
                selected={this.state.selectedDateE}
                onChange={this.handleDateChangeE}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className='popup2TH'>
              <h3 className='popup2Date'>Time:</h3>
              <TimePicker clockIcon={null} clearIcon={null} value={this.state.selectedTimeS} onChange={this.handleTimeChangeS} />
              <span className='between'>to</span>
              <TimePicker clockIcon={null}  clearIcon={null} value={this.state.selectedTimeE} onChange={this.handleTimeChangeE} />
              <button className='EventSubmit' onClick={this.addEvent} >Submit</button>
            </div>
          </div>
      ) : ''}
      </div>
    );
  }
}

export default Todo;
