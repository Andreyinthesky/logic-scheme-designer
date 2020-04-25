import React, { Component } from "react";

export default class LoadSchemeForm extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className={"form-wrapper"}>
                <div className={"load-form"}>
                    <div className="continue">
                        <span>Продолжить работу</span>
                    </div>
                    <div className="load">
                        <div>
                            <i className="fas fa-file-import"></i>
                            <span>Загрузить cхему</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}