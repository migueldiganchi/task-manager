import React, { Component } from "react";
import axios from "../../connection/axios-app";
import DatePicker from "react-datepicker";
import Validation from "../Validation";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class TaskForm extends Component {
  state = {
    id: null,
    title: "",
    dueDate: new Date(),
    creationDate: new Date(),
    filter: null,
    wasDone: false,
    filterTypes: {
      CREATION_DATE: 1,
      DUE_DATE: 2,
      PENDING: 3,
      DONE: 4,
    },
  };

  componentDidMount() {
    this.setState({
      id: this.props.task.id,
      title: this.props.task.title,
      dueDate: moment(this.props.task.dueDate).toDate(),
      creationDate: moment(this.props.task.creationDate).toDate(),
      wasDone: this.props.task.wasDone,
      formClassName: "field",
      filter:
        this.props.task && this.props.task.filter
          ? this.props.task.filter
          : this.state.filterTypes.FRIENDS,
    });
  }

  onSubmitTask = (e) => {
    e.preventDefault();
    let task =
      this.props && this.props.task
        ? {
            id: this.props.task.id,
            title: this.state.title,
            dueDate: moment(this.state.dueDate).toDate(),
            creationDate: moment(this.state.creationDate).toDate(),
            wasDone: this.state.wasDone,
          }
        : {
            title: "",
            dueDate: "",
            creationDate: "",
            wasDone: false,
          };

    if (!this.isValid(task)) {
      return;
    }

    this.saveTask(task);

    if (this.props.onSave) {
      this.props.onSave(task);
    }
  };

  saveTask = (task) => {
    let isNewTask = !task.id;
    let method = isNewTask ? axios.post : axios.put;
    let url = isNewTask ? "/tasks" : `/tasks/${task.id}`;
    let loadingMessage = isNewTask ? "Creating task..." : "Saving task...";

    // go server to save task
    this.props.onWait(loadingMessage);
    method(url, task)
      .then(() => {
        this.props.onStopWait();
        setTimeout(() => {
          let message = "Successfuly " + (isNewTask ? "created" : "updated");
          if (this.props.onSave) {
            this.props.onSave(task);
            setTimeout(() => {
              this.props.onNotify(message, "info");
            }, 333);
          }
        }, 300);
      })
      .catch((error) => {
        this.props.onNotify("Oops! Something went wrong", "error");
      });
  };

  selectDueDate = (date) => {
    this.setState({
      dueDate: date,
    });
  };

  isValid = (task) => {
    let error = false;
    let titleErrors = [];

    if (task.title === "") {
      titleErrors.push({
        message: "Body is required",
      });
      this.setState({ formClassName: "field error" });
    } else if (task.title.length < 6) {
      titleErrors.push({
        message: "Too short (min: 6)",
      });
      this.setState({ formClassName: "field error" });
    } else {
      this.setState({ formClassName: "field" });
    }

    this.setState({
      title: titleErrors,
    });

    error = titleErrors.length > 0;

    if (error) {
      this.props.onNotify("Oops", "error");
    }

    return !error;
  };

  typingTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.onSubmitTask(e);
    }
  };

  setScope = (filter) => {
    this.setState({
      filter: filter,
    });
  };

  switchDoneState = () => {
    this.setState({
      wasDone: !this.state.wasDone,
    });
  };

  render() {
    return (
      <div className="form-container">
        <form
          action="/tasks"
          method="post"
          className="form"
          onSubmit={this.onSubmitTask}
        >
          <div className="form-body">
            {/* Description of the task */}
            <div className={this.state.formClassName}>
              <textarea
                rows="2"
                autoFocus
                onKeyDown={this.onEnterPress}
                onChange={this.typingTitle}
                placeholder="Task Description"
                value={this.state.title}
              />
            </div>
            <Validation validationList={this.state.titleValidationErrors} />

            {/* Datepicker of the task */}
            <div className="text-center">
              <label className="mb-3">
                <small>When is this task due?</small>
              </label>
              <div className="field">
                <DatePicker
                  selected={this.state.dueDate}
                  onChange={this.selectDueDate}
                  placeholderText="Due date"
                  name="dueDate"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
            </div>

            {/* Done Switcher */}
            <div className="text-left">
              <div className="custom-control custom-switch my-4">
                <input
                  type="checkbox"
                  checked={this.state.wasDone}
                  value={this.state.wasDone.toString()}
                  className="custom-control-input"
                  id="doneSwitcher"
                  onChange={this.switchDoneState}
                />
                <label className="custom-control-label" htmlFor="doneSwitcher">
                  <small>Was this task completed?</small>
                  <small>
                    <b className="ml-2">
                      {this.state.wasDone ? "Yes!" : "Not yet"}
                    </b>
                  </small>
                </label>
              </div>
            </div>
          </div>

          {/* Keyboard */}
          <div className="clearfix text-center mb-5">
            <div className="keypad keypad-inline-block responsive responsive-desktop">
              <button
                type="button"
                className="do"
                onClick={this.props.onCancel}
              >
                <i className="fas fa-arrow-left" />
                Cancel
              </button>
              <button type="submit" className="do do-primary">
                <i className="fas fas fa-check" />
                {this.props.task.id ? "Update" : "Post"}
              </button>
            </div>
            <div className="keypad keypad-inline-block responsive responsive-mobile">
              <button
                type="button"
                className="do do-circular"
                onClick={this.props.onCancel}
              >
                <i className="fas fa-arrow-left" />
              </button>
              <button type="submit" className="do do-circular do-primary">
                <i className="fas fas fa-check" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default TaskForm;
