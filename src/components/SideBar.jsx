import React, { Component } from "react";
import SideBarSection from "./SidebarSection";
import { EditorContext } from "../contexts/editorContext";


const itemsModel = {
    gate: {
        title: "Базовые элементы",
        items: {
            "and": "и",
            "or": "или",
            "not": "не",
            "xor": "искл.или",
            "delay": "эл.задержки",
        }
    },
    io: {
        title: "Вход/Выход",
        items: {
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
        const model = Object.entries(itemsModel);

        return (
            <EditorContext.Consumer>
                {({ addNodeCallback }) => (
                    <ul id="select-obj" className={`obj-list ${toggle ? "hide" : ""}`}>
                        <div className="select-obj-toggler" onClick={this.handleClickToggle}>
                            <i className="fas fa-caret-left"></i>
                        </div>
                        {
                            model.map(([name, description]) =>
                                <SideBarSection key={name}
                                    title={description.title}
                                    items={description.items}
                                    onClickItem={addNodeCallback}
                                />
                            )
                        }
                    </ul>
                )}
            </EditorContext.Consumer>
        );
    }
}