import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { hideNotification } from "../redux/actions";


const DEFAULT_SHOW_TIME = 5000;

const closingStyle = {
    opacity: 0,
}

class Notification extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            close: false
        }
        this.timer = null;
    }

    componentDidMount() {
        this.timer = setTimeout(() => this.setState({ show: true }), 100);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    handleClickCloseBtn = () => {
        this.timer && clearTimeout(this.timer);
        this.setState({close: true});
        this.handleTransitionEnd = () => {
            this.state.show && this.hideNotification();
        };
    };

    handleTransitionEnd = () => {
        if (this.props.noHide)
            return;

        this.timer = setTimeout(() => this.setState({ show: false }), this.props.duration | DEFAULT_SHOW_TIME);
        this.handleTransitionEnd = () => this.hideNotification();
    }

    hideNotification = () => {
        this.props.hideNotification(this.props.id);
    }

    render() {
        const { type, title, message, focus } = this.props;
        const { show, close } = this.state;

        return (
            <li className={`msg ${show ? "show" : ""} ${type || ""}`}
                style={close ? closingStyle: null}
                onTransitionEnd={this.handleTransitionEnd}
            >
                <span className="msg-close" onClick={this.handleClickCloseBtn}><i className="fas fa-times"></i></span>
                {title && <div className="msg-title">{title}</div>}
                <div className="msg-text">{message}</div>
                {focus && <button className="focus" onClick={focus}><i className="fas fa-share-square"></i>{"Показать"}</button>}
            </li>
        );
    }
}

const mapDispatchToProps = {
    hideNotification,
}

Notification.propTypes = {
    hideNotification: PropTypes.func,
    id: PropTypes.number,
    duration: PropTypes.number,
    noHide: PropTypes.bool,
    type: PropTypes.oneOf(["success", "warning", "error"]),
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
    focus: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(Notification);