import React, { Component } from "react";
import axios from "../../connection/axios-app";
import DatePicker from "react-datepicker";
import Validation from "../Validation";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class SynapticDotForm extends Component {
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
      id: this.props.synapticDot.id,
      title: this.props.synapticDot.title,
      dueDate: moment(this.props.synapticDot.dueDate).toDate(),
      creationDate: moment(this.props.synapticDot.creationDate).toDate(),
      wasDone: this.props.synapticDot.wasDone,
      formClassName: "field",
      filter:
        this.props.synapticDot && this.props.synapticDot.filter
          ? this.props.synapticDot.filter
          : this.state.filterTypes.FRIENDS,
    });
  }

  onSubmitSynapticDot = (e) => {
    e.preventDefault();
    let synapticDot =
      this.props && this.props.synapticDot
        ? {
            id: this.props.synapticDot.id,
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

    if (!this.isValid(synapticDot)) {
      return;
    }

    this.saveSynapticDot(synapticDot);

    if (this.props.onSave) {
      this.props.onSave(synapticDot);
    }
  };

  saveSynapticDot = (synapticDot) => {
    let isNewSynapticDot = !synapticDot.id;
    let method = isNewSynapticDot ? axios.post : axios.put;
    let url = isNewSynapticDot ? "/synapticDots" : `/synapticDots/${synapticDot.id}`;
    let loadingMessage = isNewSynapticDot ? "Creating synapticDot..." : "Saving synapticDot...";

    // go server to save synapticDot
    this.props.onWait(loadingMessage);
    method(url, synapticDot)
      .then(() => {
        this.props.onStopWait();
        setTimeout(() => {
          let message = "Successfuly " + (isNewSynapticDot ? "created" : "updated");
          if (this.props.onSave) {
            this.props.onSave(synapticDot);
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

  isValid = (synapticDot) => {
    let error = false;
    let titleErrors = [];

    if (synapticDot.title === "") {
      titleErrors.push({
        message: "Body is required",
      });
      this.setState({ formClassName: "field error" });
    } else if (synapticDot.title.length < 6) {
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
      this.onSubmitSynapticDot(e);
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
          action="/synapticDots"
          method="post"
          className="form"
          onSubmit={this.onSubmitSynapticDot}
        >
          <div className="form-body">
            {/* Description of the synapticDot */}
            <div className={this.state.formClassName}>
              <textarea
                rows="2"
                autoFocus
                onKeyDown={this.onEnterPress}
                onChange={this.typingTitle}
                placeholder="SynapticDot Description"
                value={this.state.title}
              />
            </div>
            <Validation validationList={this.state.titleValidationErrors} />

            {/* Datepicker of the synapticDot */}
            <div className="text-center">
              <label className="mb-3">
                <small>When is this synapticDot due?</small>
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
                  <small>Was this synapticDot completed?</small>
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
                {this.props.synapticDot.id ? "Update" : "Post"}
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

export default SynapticDotForm;
