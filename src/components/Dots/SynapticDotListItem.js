import React from "react";
import moment from "moment";

function SynapticDotListItem(props) {
  const startRemovingHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    props.onStartRemoving(props.synapticDot);
  };

  const confirmRemoving = (e) => {
    e.stopPropagation();
    e.preventDefault();
    props.onConfirmRemoving(props.synapticDot);
  };

  const cancelRemoving = (e) => {
    e.stopPropagation();
    e.preventDefault();
    props.onCancelRemoving(props.synapticDot);
  };

  const startEdition = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("[props.synapticDot]", props.synapticDot);
    props.onEdit(props.synapticDot);
  };

  const getIconClassName = (synapticDot) => {
    const today = new Date();
    const dueDate = new Date(synapticDot.dueDate);

    if (synapticDot.wasDone) {
      return "fas fa-check text-success mr-3";
    } else if (today > +dueDate) {
      return "fas fa-calendar-times text-danger mr-3";
    } else {
      return "fas fa-clock mr-3 text-warning";
    }
  };

  const getTextClassName = (synapticDot) => {
    return synapticDot.wasDone ? "done" : "";
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
        <i className={getIconClassName(props.synapticDot)} />
        <span className={getTextClassName(props.synapticDot)}>{props.synapticDot.title}</span>
      </p>
      {keypad}
    </div>
  );
}

export default SynapticDotListItem;
