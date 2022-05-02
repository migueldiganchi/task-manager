import React from "react";
import { Route, withRouter } from "react-router-dom";
import Dev from "./components/Dev/Dev";
import Loading from "./components/Loading";
import Header from "./components/Header";
import Board from "./components/Board";
import Notifier from "./components/Notifier";
import BoardPanel from "./components/BoardPanel";
import SynapticDotManager from "./components/Dots/SynapticDotManager";

class App extends React.Component {
  state = {
    notification: null,
    waiting: null,
  };

  constructor(props) {
    super(props);
  }

  notify = (message, messageType, messageTimeout, callback) => {
    this.setState({
      notification: {
        message: message,
        type: messageType ? messageType : "info",
      },
    });

    setTimeout(() => {
      this.stopNotify();
      if (callback) {
        callback();
      }
    }, messageTimeout || 3000);
  };

  notifyError = (message) => {
    this.notify(message, "error");
  };

  stopNotify = () => {
    this.setState({ notification: null });
  };

  wait = (message, messageType) => {
    this.setState({
      waiting: message,
      notification: {
        message: message,
        type: messageType ? messageType : "default",
      },
    });
  };

  stopWait = () => {
    this.setState({
      waiting: null,
      notification: null,
    });
  };

  wall = (props) => {
    return (
      <SynapticDotManager
        waiting={this.state.waiting}
        onNotify={this.notify}
        onWait={this.wait}
        onStopWait={this.stopWait}
        {...props}
      />
    );
  };

  auth = (props) => {
    return (
      <Dev
        waiting={this.state.waiting}
        onNotify={this.notify}
        onWait={this.wait}
        onStopWait={this.stopWait}
        onAuth={this.openApp}
        {...props}
      />
    );
  };

  openApp = (credentials) => {
    const expirationDate = new Date(
      new Date().getTime() + credentials.expiresIn * 1000
    );
    localStorage.setItem("token", credentials.idToken);
    localStorage.setItem("expirationDate", expirationDate);
  };

  closeApp = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    this.props.history.push({
      pathname: "/",
    });
    this.notify("See you soon!");
    return;
  };

  render() {
    let glassApp =
      this.state.isAuthorManagerVisible || this.state.waiting ? (
        <div className="App-glass" onClick={this.toggleManager} />
      ) : null;

    let loadingApp = this.state.waiting ? <Loading /> : null;

    return (
      <div className="App">
        {glassApp}
        {loadingApp}

        <Header title="SynapticDot Manager" onLogout={this.closeApp} {...this.props} />

        <Board>
          <BoardPanel>
            <Route path="/" exact render={this.wall} />
            <Route path="/auth" render={this.auth} />
          </BoardPanel>
        </Board>

        <Notifier
          notification={this.state.notification}
          waiting={this.state.waiting}
        />
      </div>
    );
  }
}

export default withRouter(App);
