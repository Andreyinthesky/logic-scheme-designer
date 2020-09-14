import React from "react";
import PropTypes from "prop-types";
import FocusLock from "react-focus-lock";

export default class Modal extends React.Component {
    constructor() {
        super();
    }

    handleClickForeground = (evt) => {
        if (evt.target !== evt.currentTarget)
            return;

        const { onClose } = this.props;
        onClose();
    }

    render() {
        const { props } = this;

        return (
            <FocusLock>
                <div className={"modal-wrapper"} onClick={this.handleClickForeground}>
                    <div className={"modal"}>
                        {props.children}
                    </div>
                </div>
            </FocusLock>
        );
    }
}

Modal.propTypes = {
    children: PropTypes.any,
    onClose: PropTypes.func,
} 