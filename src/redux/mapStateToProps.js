const mapStateToProps = (state) => {
    const { reducer } = state;
    const redux_state = reducer;
    return { redux_state };
  };

export default mapStateToProps;