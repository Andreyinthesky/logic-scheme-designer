import React, { Component } from "react";

export default class ExportSchemeForm extends Component {
    constructor() {
        super();
    }

    render() {
        const defaultFileName = "UntitledScheme";

        return (
            <div className={"form-wrapper"}>
                <div className={"export-form"}>
                    <div className="export-form-body">
                        <label htmlFor="filename">Имя файла</label>
                        <input name="filename" type="text" value={defaultFileName}></input>
                    </div>
                    <div className="export-form-actions">
                        <button>ОК</button>
                        <button>Отмена</button>
                    </div>
                </div>
            </div>
        );
    }
}