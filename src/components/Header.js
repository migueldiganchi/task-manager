import React from "react";
import { withRouter, NavLink, matchPath } from "react-router-dom";

class Header extends React.Component {
  state = {
    closeConfirmation: false,
  };

  proposeLogout = () => {
    this.setState({
      closeConfirmation: true,
    });
  };

  declineLogout = () => {
    this.setState({
      closeConfirmation: false,
    });
  };

  doLogout = () => {
    this.setState({
      closeConfirmation: false,
    });
    this.props.onLogout();
  };

  render() {
    const isAuthdisabled = !!matchPath(this.props.location.pathname, "/auth");
    const isHomedisabled = !!matchPath(this.props.location.pathname, {
      path: "/",
      exact: true,
    });

    return (
      <header
        className={
          "App-header " +
          (this.state.closeConfirmation ? "confirming-close" : "")
        }
      >
        <div className="App-title m-0 clearfix">
          {[
            <NavLink
              key="login-desktop"
              to="/auth"
              activeClassName="disabled"
              className={
                "do do-primary float-left responsive responsive-desktop " +
                (isAuthdisabled ? "disabled" : "")
              }
            >
              <i className="fas fa-code" />
              By
            </NavLink>,
            <NavLink
              key="login-mobile"
              to="/auth"
              activeClassName="disabled"
              className={
                "do do-primary do-circular float-left responsive responsive-mobile " +
                (isAuthdisabled ? "disabled" : "")
              }
            >
              <i className="fas fa-plug" />
            </NavLink>,
          ]}

          <h5 className="App-title-text mt-1">
            {this.state.closeConfirmation ? (
              <span>
                <b className="responsive responsive-desktop">Are you sure?</b>
                <b className="responsive responsive-mobile">Sure?</b>
              </span>
            ) : (
              <NavLink
                to="/"
                activeClassName={isHomedisabled ? "" : "text-underline"}
              >
                <span>{this.props.title}</span>
              </NavLink>
            )}
          </h5>
          <NavLink
            to="/"
            exact
            className={
              "do do-primary float-right responsive responsive-desktop " +
              (isHomedisabled ? "disabled" : "")
            }
          >
            <i className="fas fa-synapticDots" />
            My synapticDots
          </NavLink>
          <NavLink
            to="/"
            exact
            className={
              "do do-primary do-circular float-right responsive responsive-mobile " +
              (isHomedisabled ? "disabled" : "")
            }
          >
            <i className="fas fa-home" />
          </NavLink>
        </div>
        <div>{this.props.children}</div>
      </header>
    );
  }
}

export default withRouter(Header);
