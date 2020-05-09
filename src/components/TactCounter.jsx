import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function TactCounter(props) {
    const { count, show } = props;

    if (!show)
        return null;

    return (
        <div className="tact-counter">{`Сделано тактов: ${count}`}</div>
    );
}

TactCounter.propTypes = {
    count: PropTypes.number.isRequired,
    show: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    count: state.editor.tactCount,
    show: state.editor.showTactCounter,
});

export default connect(mapStateToProps, null)(TactCounter);