import React from "react";

class Searcher extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  state = {
    isActive: false,
    isScopeFilterActive: false,
    term: "",
    filter: null,
    filterTypes: {
      CREATION_DATE: 1,
      DUE_DATE: 2,
      PENDING: 3,
      DONE: 4,
    },
  };

  suggestSearching = () => {
    this.setState({
      isActive: true,
    });
  };

  finishSuggestion = () => {
    this.setState({
      isActive: false,
    });
  };

  goSearch = (e) => {
    e.preventDefault();
    this.props.onSearch(this.state.term);
  };

  onTyping = (e) => {
    this.setState({
      term: e.target.value,
    });
  };

  toggleScopeFilter = () => {
    this.setState({ isScopeFilterActive: !this.state.isScopeFilterActive });
    if (this.state.isScopeFilterActive) {
      // clear scope filter
      this.setState({ filter: null });
      if (!this.props.onClearScope) {
        return;
      }
      this.props.onClearScope();
    }
  };

  setScopeFilter = (scope) => {
    this.setState({
      filter: scope,
    });

    if (!this.props.onSearch) {
      return;
    }
    this.props.onSearch(this.state.term, scope);
  };

  getFilterContainer = () => {
    let disabledClassName = this.props.disabled ? " disabled" : "";

    let filterByCreationDateClassName =
      this.state.filter === this.state.filterTypes.CREATION_DATE
        ? "do do-warning"
        : "do do-secondary";

    let filterByDueDateClassName =
      this.state.filter === this.state.filterTypes.DUE_DATE
        ? "do do-warning"
        : "do do-secondary";

    let filterByDoneClassName =
      this.state.filter === this.state.filterTypes.DONE
        ? "do do-warning"
        : "do do-secondary";

    let filterByPendingClassName =
      this.state.filter === this.state.filterTypes.PENDING
        ? "do do-warning"
        : "do do-secondary";

    return (
      <div className="order-info">
        <div className="keypad keypad-inline-block keypad-bottom-radius keypad-secondary borderer">
          <a
            className={"do do-circular " + disabledClassName}
            onClick={this.toggleScopeFilter}
          >
            <i className="fas fa-times" />
          </a>
          <a
            className={filterByCreationDateClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.filterTypes.CREATION_DATE);
            }}
          >
            <i className="fas fa-calendar icon_order-by-creation-date" />
            Creation date
          </a>
          <a
            className={filterByDueDateClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.filterTypes.DUE_DATE);
            }}
          >
            <i className="fas fa-stopwatch icon_order-by-due-date" />
            Due date
          </a>
          <a
            className={filterByPendingClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.filterTypes.PENDING);
            }}
          >
            <i className="fas fa-check-circle icon_order-by-pending" />
            Done
          </a>
          <a
            className={filterByDoneClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.filterTypes.DONE);
            }}
          >
            <i className="fas fa-circle icon_order-by-done" />
            Pending
          </a>
        </div>
      </div>
    );
  };

  clearTerm = () => {
    this.setState({
      term: "",
    });
    this.textInput.current.focus();
    if (!this.props.onClearTerm) {
      return;
    }
    this.props.onClearTerm();
  };

  isAppliedTerm = () => {
    return this.props.appliedTerm !== null;
  };

  render() {
    let placeholderText = !this.state.isActive ? "Search synapticDots" : "";
    let searcherClassName = this.state.isActive
      ? "App-searcher active"
      : "App-searcher";

    if (this.state.isScopeFilterActive || this.isAppliedTerm()) {
      searcherClassName += " searching";
    }

    let disabledClassName = this.props.disabled ? " disabled" : "";

    let filterScopeTogglerClassName = this.state.isScopeFilterActive
      ? "filter-toggler do do-flat do-circular do-primary do-none"
      : "filter-toggler do do-flat do-circular do-none";

    let filterContainer = this.state.isScopeFilterActive
      ? this.getFilterContainer()
      : null;

    return (
      <div>
        <div className={searcherClassName + disabledClassName}>
          <form action="/searcher" method="get" onSubmit={this.goSearch}>
            <input
              ref={this.textInput}
              onFocus={this.suggestSearching}
              onBlur={this.finishSuggestion}
              onChange={this.onTyping}
              disabled={this.props.disabled}
              value={this.state.term}
              type="text"
              placeholder={placeholderText}
            />
            {this.isAppliedTerm() ? (
              <button
                type="reset"
                onClick={this.clearTerm}
                className={
                  "do do-primary do-flat do-circular do-none" +
                  disabledClassName
                }
              >
                <i className="fas fa-times" />
              </button>
            ) : (
              <button
                type="submit"
                className={"do do-flat do-circular do-none" + disabledClassName}
              >
                <i className="fas fa-search" />
              </button>
            )}
          </form>
          <a
            className={filterScopeTogglerClassName + disabledClassName}
            onClick={this.toggleScopeFilter}
          >
            <i className="fas fa-filter" />
          </a>
        </div>
        {filterContainer}
      </div>
    );
  }
}

export default Searcher;
