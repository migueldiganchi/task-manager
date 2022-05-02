import React from "react";
import axios from "../../connection/axios-app";
import { withRouter } from "react-router-dom";

import Searcher from "../Searcher";
import SynapticDotList from "./SynapticDotList";
import SynapticDotListTitle from "./SynapticDotListTitle";

class SynapticDotManager extends React.Component {
  state = {
    newSynapticDot: null,
    synapticDot: null,
    removingSynapticDot: null,
    synapticDots: [],
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
    this.getSynapticDots(this.state.termFilter, this.state.filter);
  }

  getSynapticDots = (term, scope) => {
    this.props.onWait("Loading...");
    setTimeout(() => {
      axios
        .get("/synapticDots")
        .then((response) => {
          const { data: synapticDotList } = response;
          const synapticDots = [...synapticDotList];
          // Visual effects
          this.props.onStopWait();
          this.filterSynapticDots(synapticDots, term, scope);
        })
        .catch((error) => {
          console.error("[error]", error);
          this.props.onStopWait();
        });
    }, 1100);
  };

  filterSynapticDots(synapticDots, term, filter) {
    let resultingSynapticDots = [...synapticDots.reverse()];
    let currentTermFilter = null;
    let currentFilter = null;

    if (term) {
      currentTermFilter = term;
      resultingSynapticDots = [
        ...resultingSynapticDots.filter((synapticDot) => {
          return synapticDot.title.toLowerCase().includes(term.toLowerCase());
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
          this.props.onNotify("@todo: Filter by pending synapticDots", "info");
          break;
        case this.state.filterTypes.DONE:
          this.props.onNotify("@todo: Filter by done synapticDots", "info");
          break;
        default:
          this.props.onNotify("@todo: Complete filters", "info");
          break;
      }
    }

    this.setState({
      synapticDots: resultingSynapticDots,
      filter: currentFilter,
      termFilter: currentTermFilter,
    });
  }

  createSynapticDot = (synapticDot) => {
    this.setState({
      newSynapticDot: {
        id: null,
        title: "",
        dueDate: new Date(),
        creationDate: new Date(),
        wasDone: false,
      },
    });

    if (this.props.onCreateSynapticDot) {
      this.props.onCreateSynapticDot(synapticDot);
    }
  };

  editSynapticDot = (synapticDot) => {
    this.setState({
      editingSynapticDot: synapticDot,
    });
  };

  startRemoving = (synapticDot) => {
    this.setState({
      removingSynapticDot: synapticDot,
    });
  };

  removeSynapticDot = (synapticDot) => {
    let url = `/synapticDots/${synapticDot.id}`;

    this.props.onWait("Removing synapticDot...");
    axios
      .delete(url)
      .then(() => {
        this.props.onStopWait();
        this.cancelRemoving();
        this.getSynapticDots(this.state.termFilter, this.state.filter);
        setTimeout(() => {
          this.props.onNotify("SynapticDot was removed successfuly", "info");
        }, 300);
      })
      .catch((error) => {
        console.error("[error]", error);
        this.props.onStopWait();
        this.cancelRemoving();
        this.props.onNotify(
          "Oops! Something went wrong while removing a synapticDot :(",
          "error"
        );
      });
  };

  cancelRemoving = () => {
    this.setState({
      removingSynapticDot: null,
    });
  };

  onSaveSynapticDot = () => {
    this.getSynapticDots(this.state.termFilter, this.state.filter);
    this.cancelSynapticDotForm();
  };

  cancelSynapticDotForm = () => {
    this.setState({
      newSynapticDot: null,
      editingSynapticDot: null,
    });

    if (this.props.onCancelSynapticDotForm) {
      this.props.onCancelSynapticDotForm();
    }
  };

  clearScopeFilter = () => {
    this.setState({
      filter: null,
    });
    setTimeout(() => {
      this.getSynapticDots(this.state.termFilter, null);
    }, 33);
  };

  clearTermFilter = () => {
    this.setState({
      termFilter: null,
    });
    setTimeout(() => {
      this.getSynapticDots(null, this.state.filter);
    }, 33);
  };

  render() {
    let icon = null;
    let searcher = null;
    let workingTitle = null;
    let synapticDotListTitle = null;
    let synapticDotListTitleTextScope = "All my synapticDots";
    let synapticDotListTitleTextTerm = "";
    let synapticDotCount = this.state.synapticDots
      ? this.state.synapticDots.length
      : 0;

    if (this.state.termFilter) {
      synapticDotListTitleTextTerm = `${this.state.termFilter}`;
    }

    if (this.state.filter) {
      switch (this.state.filter) {
        case this.state.filterTypes.CREATION_DATE:
          synapticDotListTitleTextScope = "By Creation Date";
          break;
        case this.state.filterTypes.DUE_DATE:
          synapticDotListTitleTextScope = "By Due Date";
          break;
        case this.state.filterTypes.PENDING:
          synapticDotListTitleTextScope = "By Pending";
          break;
        case this.state.filterTypes.DONE:
          synapticDotListTitleTextScope = "By Done";
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
            this.state.removingSynapticDot ||
            this.state.newSynapticDot ||
            this.state.editingSynapticDot
          }
          onSearch={this.getSynapticDots}
          onClearScope={this.clearScopeFilter}
          onClearTerm={this.clearTermFilter}
        />
      </div>
    );

    if (this.state.removingSynapticDot) {
      workingTitle = "Removing synapticDot";
    } else if (this.state.editingSynapticDot) {
      workingTitle = "Editing synapticDot";
    } else if (this.state.newSynapticDot) {
      workingTitle = "New synapticDot";
    }

    synapticDotListTitle = workingTitle ? (
      <SynapticDotListTitle
        featured={true}
        disabled={true}
        title={workingTitle}
      />
    ) : (
      <SynapticDotListTitle
        disabled={
          this.state.removingSynapticDot ||
          this.state.newSynapticDot ||
          this.state.editingSynapticDot
        }
        title={synapticDotListTitleTextScope}
        results={synapticDotCount}
        resultsFilterTermText={synapticDotListTitleTextTerm}
        synapticDots={this.state.synapticDots}
        onCreateSynapticDot={this.createSynapticDot}
      />
    );

    return (
      <div className="pb-4 pt-4">
        <div className="mb-4">{icon}</div>
        {!this.state.newSynapticDot && !this.state.editingSynapticDot
          ? searcher
          : null}
        {synapticDotListTitle}
        <SynapticDotList
          author={this.props.author}
          newSynapticDot={this.state.newSynapticDot}
          editingSynapticDot={this.state.editingSynapticDot}
          removingSynapticDot={this.state.removingSynapticDot}
          synapticDots={this.state.synapticDots}
          disableItems={this.state.newSynapticDot}
          onCreateSynapticDot={this.createSynapticDot}
          onNotify={this.props.onNotify}
          onSave={this.onSaveSynapticDot}
          onCancel={this.cancelSynapticDotForm}
          onEdit={this.editSynapticDot}
          onStartRemoving={this.startRemoving}
          onConfirmRemoving={this.removeSynapticDot}
          onCancelRemoving={this.cancelRemoving}
          onWait={this.props.onWait}
          onStopWait={this.props.onStopWait}
        />
      </div>
    );
  }
}

export default withRouter(SynapticDotManager);
