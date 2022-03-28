import React from "react";
import moment from "moment";

function TaskListItem(props) {
  const startRemovingHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    props.onStartRemoving(props.task);
  };

  const confirmRemoving = (e) => {
    e.stopPropagation();
    e.preventDefault();
    props.onConfirmRemoving(props.task);
  };

  const cancelRemoving = (e) => {
    e.stopPropagation();
    e.preventDefault();
    props.onCancelRemoving(props.task);
  };

  const startEdition = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("[props.task]", props.task);
    props.onEdit(props.task);
  };

  const getIconClassName = (task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);

    if (task.wasDone) {
      return "fas fa-check text-success mr-3";
    } else if (today > +dueDate) {
      return "fas fa-calendar-times text-danger mr-3";
    } else {
      return "fas fa-clock mr-3 text-warning";
    }
  };

  const getTextClassName = (task) => {
    return task.wasDone ? "done" : "";
  };

  let listItemClassName = "list-item";
  let confirmation = null;
  let keypad = null;

  if (props.isRemoving) {
    listItemClassName = "list-item removing";
    confirmation = (
      <div className="keypad confirmation fixed bg-tr">
        <h4>Are you sure?</h4>
      </div>
    );

    keypad = (
      <div>
        <div className="keypad fixed responsive responsive-desktop">
          <button type="button" className="do" onClick={cancelRemoving}>
            <i className="fas fa-arrow-left" />
            Cancel
          </button>
          <a className="do do-danger" onClick={confirmRemoving}>
            <i className="fas fa-trash" />
            Remove
          </a>
        </div>
        <div className="keypad fixed responsive responsive-mobile">
          <button
            type="button"
            className="do do-circular"
            onClick={cancelRemoving}
          >
            <i className="fas fa-ban" />
          </button>
          <a className="do do-danger" onClick={confirmRemoving}>
            <i className="fas fa-trash" />
            Yes
          </a>
        </div>
      </div>
    );
  } else if (props.isDisabled) {
    listItemClassName = "list-item disabled";
  } else {
    keypad = (
      <div className="keypad">
        <a className="do do-circular do-danger" onClick={startRemovingHandler}>
          <i className="fas fa-trash" />
        </a>
        <a className="do do-circular do-primary" onClick={startEdition}>
          <i className="fas fa-pencil-alt" />
        </a>
      </div>
    );
  }

  return (
    <div className={listItemClassName}>
      {confirmation}
      <p>
        <i className={getIconClassName(props.task)} />
        <span className={getTextClassName(props.task)}>{props.task.title}</span>
      </p>
      {keypad}
    </div>
  );
}

export default TaskListItem;
