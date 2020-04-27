import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";


class EditorStatusBar extends Component {
    constructor() {
        super();
    }

    render() {
        const { scale } = this.props;
        const scaleInPercents = Math.round(scale * 100);

        return (
            <span className="show-scale">
                {`Масштаб:`} <span id="show-scale"> {`${scaleInPercents}%`}</span>
            </span>
        );
    }
}

EditorStatusBar.propTypes = {
    scale: PropTypes.number,
}

const mapStateToProps = state => ({
    scale: state.editor.scale
})

export default connect(mapStateToProps, null)(EditorStatusBar);