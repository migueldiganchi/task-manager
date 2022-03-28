import React from "react";
import { withRouter } from "react-router-dom";

class Auth extends React.Component {
  emailInput;

  state = {
    waiting: null,
  };

  onGoAuth = (e) => {
    e.preventDefault();
    if (!this.isValid()) {
      return null;
    }

    this.props.onWait("Authenticating...");
    setTimeout(() => {
      this.props.onStopWait();
      this.props.onNotify("Welcome to Task Manager!");
    }, 3000);
  };

  render() {
    return (
      <div className="auth">
        {/* Logo icon */}
        <div className="text-center logo-holder my-5">
          <i className="fas fa-code" />
        </div>

        {/* Dev */}
        <div className="dev-box">
          <h4 className="dev-box-title mb-4 mt-2">
            <b>By Mike-IO</b>
          </h4>

          <div className="dev-box-description">
            This solution was thinked to allow you handle your daily objectives
          </div>

          <div className="dev-box-link text-center mt-5">
            <u>
              <a
                href="https://mike-io.herokuapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-featured"
              >
                <i className="fas fa-heart mr-2" />
                Mike-IO
                <i className="fas fa-external-link-alt ml-2" />
              </a>
            </u>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Auth);
