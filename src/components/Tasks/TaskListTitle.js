import React from "react";

function TaskListTitle(props) {
  return (
    <div className="keypad board-panel-keypad text-center mt-2 mb-4">
      <div className={props.featured ? "text text-featured" : "text"}>
        <span>{props.title}</span>
        {props.results ? <small>{props.results} results</small> : null}
        {props.resultsFilterTermText ? (
          <small>
            (<b className="text-featured">{props.resultsFilterTermText}</b>)
          </small>
        ) : null}
      </div>
      {!props.disabled ? (
        <div
          className={
            "adder-container keypad my-3 " + (props.disabled ? " " : "")
          }
        >
          <a
            disabled={props.disabled}
            className={"do do-primary no-margin"}
            onClick={props.onCreateTask}
          >
            <i className="fas fa-plus" />
            New task
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default TaskListTitle;
