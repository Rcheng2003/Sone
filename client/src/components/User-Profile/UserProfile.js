import React from "react";
import { useState, useEffect } from "react";
import { Resizable } from "react-resizable";
import Draggable from "react-draggable";
import "./userProfile.css"; // Import the CSS file for styling
//API
const api_base = "http://localhost:3001";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 400,
      height: 300,
      position: { x: 400, y: 100 },
      isBoxOpen: true,
    };
  }

  handleResize = (e, { size }) => {
    this.setState({
      width: size.width,
      height: size.height,
    });
  };

  handleDrag = (e, ui) => {
    const { x, y } = this.state.position;
    this.setState({
      position: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
  };

  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  render() {
    const { width, height, position } = this.state;
    const { user, email } = this.props;

    return (
      <Draggable position={position} onDrag={this.handleDrag} handle=".handle">
        <div
          style={{
            width: width,
            height: height,
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          className="resizable-box"
        >
          <Resizable
            width={width}
            height={height}
            onResize={this.handleResize}
            minConstraints={[300, 200]}
            maxConstraints={[1000, 1000]}
          >
            <div className="box">
              <div className="handle">
                <div className="handle-content">User Profile</div>
                <button className="close-button" onClick={this.handleClose}>
                  -
                </button>
              </div>
              <div className="content">
                <h1>
                  Hello {user}, your email is {email}
                </h1>
                <button>Logout</button>
              </div>
            </div>
          </Resizable>
        </div>
      </Draggable>
    );
  }
}

export default UserProfile;
