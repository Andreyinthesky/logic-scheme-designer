import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { hideContextMenu } from "../redux/actions";

class EditorContextMenu extends Component {
    constructor() {
        super();
    }

    handleClickDeleteAction = () => {
        this.props.onDeleteAction();
        this.closeMenu();
    }

    handleClickRotateAction = () => {
        this.props.onRotateAction();
        this.closeMenu();
    }

    closeMenu() {
        this.props.hideContextMenu();
    }

    render() {
        const { menuData } = this.props;
        if (!menuData) return null;

        const { x, y } = menuData;

        return (
            <div className="context-menu" style={{ left: x, top: y }}>
                <ul className="context-menu__list">
                    <li onClick={this.handleClickDeleteAction}>
                        <i className="fas fa-trash-alt"></i>
                        {"Удалить"}
                    </li>
                    <li onClick={this.handleClickRotateAction}>
                        <span>
                            <i className="fas fa-exchange-alt"></i>
                            {"Повернуть на 180"}&#176;
                        </span>
                    </li>
                </ul>
            </div>
        );
    }
}

EditorContextMenu.propTypes = {
    menuData: PropTypes.object,
    hideContextMenu: PropTypes.func.isRequired,
    onDeleteAction: PropTypes.func.isRequired,
    onRotateAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    menuData: state.editor.contextMenuData,
});

const mapDispatchToProps = {
    hideContextMenu
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContextMenu);