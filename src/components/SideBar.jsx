import React, { Component } from "react";
import SideBarSection from "./SidebarSection";

const graphicObjectsModel = {
    gate: {
        title: "Базовые элементы",
        objs: {
            "and": "и",
            "or": "или",
            "not": "не",
            "xor": "искл.или",
            "delay": "эл.задержки",
        }
    },
    io: {
        title: "Вход/Выход",
        objs: {
            "input": "вход",
            "output": "выход",
        }
    }
}

export default class SideBar extends Component {
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
        const model = Object.entries(graphicObjectsModel);

        return (
            <ul id="select-obj" className={`obj-list ${toggle ? "hide" : null}`}>
                <div className="select-obj-toggler" onClick={this.handleClickToggle}><i className="fas fa-caret-left"></i></div>
                {
                    model.map(([name, description]) =>
                        <SideBarSection key={name} model={description} />
                    )
                }
            </ul>
        );
    }
}