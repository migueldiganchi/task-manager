import React from "react";
import axios from "../../connection/axios-app";
import { withRouter } from "react-router-dom";

import Searcher from "../Searcher";
import TaskList from "./TaskList";
import TaskListTitle from "./TaskListTitle";

class TaskManager extends React.Component {
  state = {
    newTask: null,
    task: null,
    removingTask: null,
    tasks: [],
    termFilter: null,
    filter: null,
    filterTypes: {
      CREATION_DATE: 1,
      DUE_DATE: 2,
      DONE: 3,
      PENDING: 4,
    },
  };

  componentDidMount() {
    this.getTasks(this.state.termFilter, this.state.filter);
  }

  getTasks = (term, scope) => {
    this.props.onWait("Loading...");
    setTimeout(() => {
      axios
        .get("/tasks")
        .then((response) => {
          const { data: taskList } = response;
          const tasks = [...taskList];
          // Visual effects
          this.props.onStopWait();
          this.filterTasks(tasks, term, scope);
        })
        .catch((error) => {
          console.error("[error]", error);
          this.props.onStopWait();
        });
    }, 1100);
  };

  filterTasks(tasks, term, filter) {
    let resultingTasks = [...tasks.reverse()];
    let currentTermFilter = null;
    let currentFilter = null;

    if (term) {
      currentTermFilter = term;
      resultingTasks = [
        ...resultingTasks.filter((task) => {
          return task.title.toLowerCase().includes(term.toLowerCase());
        }),
      ];
    }

    if (filter) {
      currentFilter = filter;
      switch (filter) {
        case this.state.filterTypes.CREATION_DATE:
          this.props.onNotify("@todo: Filter by creation date", "info");
          break;
        case this.state.filterTypes.DUE_DATE:
          this.props.onNotify("@todo: Filter by due date", "info");
          break;
        case this.state.filterTypes.PENDING:
          this.props.onNotify("@todo: Filter by pending tasks", "info");
          break;
        case this.state.filterTypes.DONE:
          this.props.onNotify("@todo: Filter by done tasks", "info");
          break;
        default:
          this.props.onNotify("@todo: Complete filters", "info");
          break;
      }
    }

    this.setState({
      tasks: resultingTasks,
      filter: currentFilter,
      termFilter: currentTermFilter,
    });
  }

  createTask = (task) => {
    this.setState({
      newTask: {
        id: null,
        title: "",
        dueDate: new Date(),
        creationDate: new Date(),
        wasDone: false,
      },
    });

    if (this.props.onCreateTask) {
      this.props.onCreateTask(task);
    }
  };

  editTask = (task) => {
    this.setState({
      editingTask: task,
    });
  };

  startRemoving = (task) => {
    this.setState({
      removingTask: task,
    });
  };

  removeTask = (task) => {
    let url = `/tasks/${task.id}`;

    this.props.onWait("Removing task...");
    axios
      .delete(url)
      .then(() => {
        this.props.onStopWait();
        this.cancelRemoving();
        this.getTasks(this.state.termFilter, this.state.filter);
        setTimeout(() => {
          this.props.onNotify("Task was removed successfuly", "info");
        }, 300);
      })
      .catch((error) => {
        console.error("[error]", error);
        this.props.onStopWait();
        this.cancelRemoving();
        this.props.onNotify(
          "Oops! Something went wrong while removing a task :(",
          "error"
        );
      });
  };

  cancelRemoving = () => {
    this.setState({
      removingTask: null,
    });
  };

  onSaveTask = () => {
    this.getTasks(this.state.termFilter, this.state.filter);
    this.cancelTaskForm();
  };

  cancelTaskForm = () => {
    this.setState({
      newTask: null,
      editingTask: null,
    });

    if (this.props.onCancelTaskForm) {
      this.props.onCancelTaskForm();
    }
  };

  clearScopeFilter = () => {
    this.setState({
      filter: null,
    });
    setTimeout(() => {
      this.getTasks(this.state.termFilter, null);
    }, 33);
  };

  clearTermFilter = () => {
    this.setState({
      termFilter: null,
    });
    setTimeout(() => {
      this.getTasks(null, this.state.filter);
    }, 33);
  };

  render() {
    let icon = null;
    let searcher = null;
    let workingTitle = null;
    let taskListTitle = null;
    let taskListTitleTextScope = "All my tasks";
    let taskListTitleTextTerm = "";
    let taskCount = this.state.tasks ? this.state.tasks.length : 0;

    if (this.state.termFilter) {
      taskListTitleTextTerm = `${this.state.termFilter}`;
    }

    if (this.state.filter) {
      switch (this.state.filter) {
        case this.state.filterTypes.CREATION_DATE:
          taskListTitleTextScope = "By Creation Date";
          break;
        case this.state.filterTypes.DUE_DATE:
          taskListTitleTextScope = "By Due Date";
          break;
        case this.state.filterTypes.PENDING:
          taskListTitleTextScope = "By Pending";
          break;
        case this.state.filterTypes.DONE:
          taskListTitleTextScope = "By Done";
          break;
        default:
          break;
      }
    }

    icon = (
      <div className="text-center logo-holder">
        <i className="fas fa-tasks" />
      </div>
    );

    searcher = (
      <div className="mb-2 py-3">
        <Searcher
          appliedTerm={this.state.termFilter}
          disabled={
            this.state.removingTask ||
            this.state.newTask ||
            this.state.editingTask
          }
          onSearch={this.getTasks}
          onClearScope={this.clearScopeFilter}
          onClearTerm={this.clearTermFilter}
        />
      </div>
    );

    if (this.state.removingTask) {
      workingTitle = "Removing task";
    } else if (this.state.editingTask) {
      workingTitle = "Editing task";
    } else if (this.state.newTask) {
      workingTitle = "New task";
    }

    taskListTitle = workingTitle ? (
      <TaskListTitle featured={true} disabled={true} title={workingTitle} />
    ) : (
      <TaskListTitle
        disabled={
          this.state.removingTask ||
          this.state.newTask ||
          this.state.editingTask
        }
        title={taskListTitleTextScope}
        results={taskCount}
        resultsFilterTermText={taskListTitleTextTerm}
        tasks={this.state.tasks}
        onCreateTask={this.createTask}
      />
    );

    return (
      <div className="pb-4 pt-4">
        <div className="mb-4">{icon}</div>
        {searcher}
        {taskListTitle}
        <TaskList
          author={this.props.author}
          newTask={this.state.newTask}
          editingTask={this.state.editingTask}
          removingTask={this.state.removingTask}
          tasks={this.state.tasks}
          disableItems={this.state.newTask}
          onCreateTask={this.createTask}
          onNotify={this.props.onNotify}
          onSave={this.onSaveTask}
          onCancel={this.cancelTaskForm}
          onEdit={this.editTask}
          onStartRemoving={this.startRemoving}
          onConfirmRemoving={this.removeTask}
          onCancelRemoving={this.cancelRemoving}
          onWait={this.props.onWait}
          onStopWait={this.props.onStopWait}
        />
      </div>
    );
  }
}

export default withRouter(TaskManager);
