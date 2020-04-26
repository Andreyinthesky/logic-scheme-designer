import React, { Component } from "react";

export default class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <header>
                <h1>Конструктор логических схем</h1>

                <div className="tools-panel">
                    <div className="canvas-actions">
                        <button title="Отменить (Undo)">
                            <i className="fas fa-reply"></i>
                        </button>
                        <button title="Повторить (Redo)">
                            <i className="fas fa-share"></i>
                        </button>
                        <button title="Удалить (Delete)">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                        <button id="fit-btn" title="В начало координат (Go to origin)">
                            <i className="fas fa-compress"></i>
                        </button>
                        <button title="Масштаб (Scale)">
                            <i className="fas fa-search"></i>
                            <i className="fas fa-angle-down"></i>
                        </button>
                        <button className="down-scale" title="Уменьшить масштаб (Down scale)">
                            <i className="fas fa-search-minus"></i>
                        </button>
                        <button className="up-scale" title="Увеличить масштаб (Up scale)">
                            <i className="fas fa-search-plus"></i>
                        </button>
                    </div>

                    <div className="scheme-control">
                        <button id="testMode-btn"><i className="fas fa-caret-square-right"></i>{"В режим симуляции"}</button>
                        <button id="doTact-btn" disabled>Сделать такт</button>
                        <button id="discard-inputs-btn" disabled>Сбросить входы</button>
                    </div>
                </div>

                <div className="app-control">
                    <button>
                        <i className="fas fa-cloud-upload-alt"></i>
                        {"Загрузить" + "..."}
                    </button>
                    <button>
                        <i className="fas fa-download"></i>
                        {"Экспорт в файл" + "..."}
                    </button>
                </div>
            </header>
        );
    }
}