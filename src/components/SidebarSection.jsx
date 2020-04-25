import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SideBarSection extends Component {
    constructor() {
        super();
        this.state = {
            toggle: false
        }
    }

    handleClickToggle = () => {
        this.setState({ toggle: !this.state.toggle });
    }

    render() {
        const { toggle } = this.state;
        const { model } = this.props;
        const { title, objs } = model;

        return (
            <li className="card">
                <div className="card-header">
                    <span className="card-title">{title}</span>
                    <i className="fas fa-caret-up toggle"
                        style={{ transform: toggle && "rotate(180deg)" }}
                        onClick={this.handleClickToggle}>
                    </i>
                </div>
                <ul className="card-body" style={{ display: toggle && "none" }}>
                    {
                        Object.entries(objs).map(([id, name]) => {
                            return (
                                <li key={id} id={id} className={`obj ${id}`}>
                                    <div className="img"></div>
                                    <span className="name">{name}</span>
                                </li>
                            );
                        })
                    }
                </ul>
            </li>
        );
    }
}

SideBarSection.propTypes = {
    model: PropTypes.object,
}