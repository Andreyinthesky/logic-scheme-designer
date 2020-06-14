import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Notification from "./Notification";

const MAX_NOTIFICATIONS_COUNT = 5

class NotificationsArea extends Component {
    constructor() {
        super();
    }

    renderNotifications = (notifications) => {
        return notifications
            .slice(0, MAX_NOTIFICATIONS_COUNT)
            .map(({ id, type, message, title, duration, focus }) => (
                <Notification
                    id={id}
                    key={id}
                    type={type}
                    title={title}
                    duration={duration}
                    message={message}
                    focus={focus}
                />
            ));
    };

    render() {
        const { notifications } = this.props;

        return (
            <div className="msg-list">
                <ul>
                    {this.renderNotifications(notifications)}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    notifications: state.app.notifications
});

NotificationsArea.propTypes = {
    notifications: PropTypes.array,
}

export default connect(mapStateToProps, null)(NotificationsArea);