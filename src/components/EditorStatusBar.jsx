import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";


class EditorStatusBar extends Component {
    constructor() {
        super();
    }

    render() {
        const { scale, mouseCoords } = this.props;
        const scaleInPercents = Math.round(scale * 100);
        const { x, y } = mouseCoords;

        return (
            <div className="editor-statusbar">
                <div>{`Масштаб:`}  {`${scaleInPercents}%`}</div>
                <div>{`X: ${x} Y: ${y}`}</div>
            </div>
        );
    }
}

EditorStatusBar.propTypes = {
    scale: PropTypes.number,
    mouseCoords: PropTypes.object,
}

const mapStateToProps = state => ({
    scale: state.editor.scale,
    mouseCoords: state.editor.mouseCoords,
})

export default connect(mapStateToProps, null)(EditorStatusBar);