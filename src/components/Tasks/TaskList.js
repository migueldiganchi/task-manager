import React from "react";

import TaskListItem from "./TaskListItem";
import TaskForm from "./TaskForm";

function TaskList(props) {
  const renderList = () => {
    if (props.tasks && props.tasks.length > 0) {
      return props.tasks.map((task) => {
        return isEditing(task) ? (
          <TaskForm
            key={task.id}
            task={props.editingTask}
            onCancel={props.onCancel}
            onNotify={props.onNotify}
            onSave={props.onSave}
            author={props.author}
            onWait={props.onWait}
            onStopWait={props.onStopWait}
          />
        ) : (
          <TaskListItem
            key={task.id}
            task={task}
            isRemoving={isRemoving(task)}
            isDisabled={isDisabled(task)}
            onEdit={props.onEdit}
            onStartRemoving={props.onStartRemoving}
            onConfirmRemoving={props.onConfirmRemoving}
            onCancelRemoving={props.onCancelRemoving}
            onOpen={goTask}
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

  const isEditing = (task) => {
    return props.editingTask && props.editingTask.id === task.id;
  };

  const isRemoving = (task) => {
    return props.removingTask && props.removingTask.id === task.id;
  };

  const isDisabled = (task) => {
    return (
      props.disableItems ||
      (props.editingTask && props.editingTask.id !== task.id) ||
      (props.removingTask && props.removingTask.id !== task.id)
    );
  };

  const goTask = (task) => {
    props.history.push({
      pathname: "/task/" + task.id,
    });
  };

  let newForm = null;
  
  if (props.newTask) {
    newForm = (
      <TaskForm
        task={props.newTask}
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
      <div className="task-list">{renderList()}</div>
    </div>
  );
}

export default TaskList;
