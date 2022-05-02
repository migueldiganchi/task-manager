import React from "react";

import SynapticDotListItem from "./SynapticDotListItem";
import SynapticDotForm from "./SynapticDotForm";

function SynapticDotList(props) {
  const renderList = () => {
    if (props.synapticDots && props.synapticDots.length > 0) {
      return props.synapticDots.map((synapticDot) => {
        return isEditing(synapticDot) ? (
          <SynapticDotForm
            key={synapticDot.id}
            synapticDot={props.editingSynapticDot}
            onCancel={props.onCancel}
            onNotify={props.onNotify}
            onSave={props.onSave}
            author={props.author}
            onWait={props.onWait}
            onStopWait={props.onStopWait}
          />
        ) : (
          <SynapticDotListItem
            key={synapticDot.id}
            synapticDot={synapticDot}
            isRemoving={isRemoving(synapticDot)}
            isDisabled={isDisabled(synapticDot)}
            onEdit={props.onEdit}
            onStartRemoving={props.onStartRemoving}
            onConfirmRemoving={props.onConfirmRemoving}
            onCancelRemoving={props.onCancelRemoving}
            onOpen={goSynapticDot}
          />
        );
      });
    } else if (!(props.disableItems || props.isEditing || props.isRemoving)) {
      return (
        <div className="pa-5 mt-5">
          <div className="mt-5 pt-5 text-muted">
            <b>Nothing here</b>
          </div>
        </div>
      );
    }
  };

  const isEditing = (synapticDot) => {
    return props.editingSynapticDot && props.editingSynapticDot.id === synapticDot.id;
  };

  const isRemoving = (synapticDot) => {
    return props.removingSynapticDot && props.removingSynapticDot.id === synapticDot.id;
  };

  const isDisabled = (synapticDot) => {
    return (
      props.disableItems ||
      (props.editingSynapticDot && props.editingSynapticDot.id !== synapticDot.id) ||
      (props.removingSynapticDot && props.removingSynapticDot.id !== synapticDot.id)
    );
  };

  const goSynapticDot = (synapticDot) => {
    props.history.push({
      pathname: "/synapticDot/" + synapticDot.id,
    });
  };

  let newForm = null;
  
  if (props.newSynapticDot) {
    newForm = (
      <SynapticDotForm
        synapticDot={props.newSynapticDot}
        onCancel={props.onCancel}
        onSave={props.onSave}
        onNotify={props.onNotify}
        author={props.author}
        onWait={props.onWait}
        onStopWait={props.onStopWait}
      />
    );
  }

  return (
    <div className="list-container">
      {newForm}
      <div className="synapticDot-list">{renderList()}</div>
    </div>
  );
}

export default SynapticDotList;
