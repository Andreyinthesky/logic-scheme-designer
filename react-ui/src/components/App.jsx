import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    updateScale,
    updateMouseCoords,
    setMode,
    setFilename,
    showNotification,
    reInitEditor,
    showLoadForm,
    increaseTactCount,
    showTactCounter,
    hideTactCounter,
    showSchemeControls,
    hideSchemeControls,
    showContextMenu,
    hideContextMenu
} from "../redux/actions";
import { connect } from "react-redux";

import LoadSchemeModal from "./LoadSchemeModal";
import ExportSchemeModal from "./ExportSchemeModal";
import Header from "./Header";
import EditorArea from "./EditorArea";
import { EditorContext } from "../contexts/editorContext";
import SchemeEditor from "../model/schemeEditor/SchemeEditor";
import NotificationsArea from "./NotificationsArea";
import { EDITOR_EDITING_MODE } from "../model/constants";


class App extends Component {
    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentDidMount() {
        const editor = new SchemeEditor(document.getElementById("mountNode"));
        this.editor = editor;
        this.bindEditorEvents(this.editor);

        window.onbeforeunload = (evt) => {
            this.saveAppState();
        }

        this.tryRestoreEditorState() || this.props.showLoadForm();
    }

    bindEditorEvents = (editor) => {
        editor.onWheel = (evt) => {
            let { deltaY } = evt;
            deltaY = deltaY || -evt.wheelDelta;

            if (deltaY < 0) {
                this.upScale();
            } else {
                this.downScale();
            }
        };

        editor.onUpdateScale = (evt) => {
            this.props.updateScale(evt.scale);
        };

        editor.onMouseMove = (evt) => {
            this.props.updateMouseCoords({ x: evt.x, y: evt.y });
        }

        editor.onChangeMode = (evt) => {
            this.props.setMode(evt.mode);
            if (evt.mode === EDITOR_EDITING_MODE) {
                this.props.hideTactCounter();
                this.props.hideSchemeControls();
            } else {
                this.props.showTactCounter();
                this.props.showSchemeControls();
            }
        };

        editor.afterEvaluateScheme = (evt) => {
            this.props.increaseTactCount();
        }

        editor.afterImportScheme = (evt) => {
            const { schemeName } = evt;
            this.props.reInitEditor();
            this.props.setFilename(schemeName);
            this.props.showNotification({
                message: `Схема "${schemeName}" успешно загружена`,
                type: "success"
            });
        }

        editor.onError = ({ error, focus }) => {
            this.props.showNotification({
                title: "Ошибка в построении схемы",
                type: "error",
                duration: 10000,
                message: error,
                focus
            });
        }

        editor.onOpenContextMenu = (data) => {
            this.props.showContextMenu(data);
        };

        editor.onCloseContextMenu = () => {
            this.props.hideContextMenu();
        };

        document.addEventListener("keydown", (evt) => {
            if (evt.repeat || document.activeElement.tagName === "INPUT") {
                return;
            }

            switch (evt.code) {
                case "Delete":
                    this.deleteSelected();
                    break;
                case "KeyZ":
                    if (evt.ctrlKey) {
                        this.undo();
                    }
                    break;
                case "KeyY":
                    if (evt.ctrlKey) {
                        this.redo();
                    }
                    break;
                default:
                    break;
            }
        })
    }

    initNewScheme = () => {
        this.editor.restart();
        localStorage.removeItem("appState");
        this.props.reInitEditor();
    }

    addNode = (type) => {
        this.editor.addNode(type);
    }

    deleteSelected = () => {
        this.editor.deleteSelectedItems();
    }

    rotateSelected = () => {
        this.editor.rotateSelectedItems();
    }

    setMode = (mode) => {
        this.editor.setMode(mode);
    }

    goToOrigin = () => {
        this.editor.goToOrigin();
    }

    canvasResize = () => {
        this.editor.canvasResize();
    }

    upScale = () => {
        let scale = this.editor.getScale();
        scale = parseFloat((scale + 0.1).toFixed(1));
        this.setScale(scale);
    }

    downScale = () => {
        let scale = this.editor.getScale();
        scale = parseFloat((scale - 0.1).toFixed(1));
        this.setScale(scale);
    }

    setScale = (scale) => {
        this.editor.setScale(scale);
    }

    evaluateScheme = () => {
        this.editor.evaluateScheme();
    }

    discardInputs = () => {
        this.editor.discardSchemeInputsState();
    }

    discardDelays = () => {
        this.editor.discardSchemeDelaysState();
    }

    importScheme = (fileData) => {
        try {
            this.editor.importScheme(fileData);
        } catch(err) {
            console.error(err);
            this.props.showNotification({ message: "Схему импортировать не удалось. Попробуйте еще раз", type: "error" });
        }
    }

    exportSchemeToFile = (filename) => {
        const fileData = this.editor.exportScheme(filename);
        const file = new Blob([JSON.stringify(fileData)], { type: "application/json" });

        try {
            // MS browsers
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, `${fileData.name}.json`);
            }
            else {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(file);
                link.download = fileData.name;
                link.click();
                setTimeout(() => URL.revokeObjectURL(link.href), 100);
            }
        } catch (err) {
            this.props.showNotification({ message: "Схему экспортировать не удалось. Попробуйте еще раз", type: "error" });
            return;
        }

        this.props.showNotification({ message: "Схема успешно экспортирована", type: "success" });
    }

    tryRestoreEditorState = () => {
        const appState = JSON.parse(localStorage.getItem("appState"));
        if (!appState)
            return;
        const timeout = 15 * 60 * 1000;
        const passed = Math.abs(new Date(appState.timeStamp) - Date.now());

        if (passed >= timeout) {
            localStorage.removeItem("appState");
            return false;
        } else {
            let verdict = true;
            try {
                const { editorState } = appState
                this.editor.restart(editorState);
                appState.filename && this.props.setFilename(appState.filename);
            } catch (err) {
                localStorage.removeItem("appState");
                verdict = false;
            }
            return verdict;
        }
    }

    saveAppState = () => {
        const appState = {
            editorState: this.editor.getCurrentState(),
            filename: this.props.filename,
            timeStamp: Date.now(),
        };

        localStorage.setItem("appState", JSON.stringify(appState));
    }

    undo = () => {
        this.editor.undo();
    }

    redo = () => {
        this.editor.redo();
    }

    render() {
        return (
            <>
                <EditorContext.Provider value={{
                    addNodeCallback: this.addNode,
                    upScaleCallback: this.upScale,
                    downScaleCallback: this.downScale,
                    deleteSelectedCallback: this.deleteSelected,
                    rotateSelectedCallback: this.rotateSelected,
                    goToOriginCallback: this.goToOrigin,
                    canvasResizeCallback: this.canvasResize,
                    setModeCallback: this.setMode,
                    doTactCallback: this.evaluateScheme,
                    discardInputsCallback: this.discardInputs,
                    discardDelaysCallback: this.discardDelays,
                    setScaleCallback: this.setScale,
                    undoEditorActionCallback: this.undo,
                    redoEditorActionCallback: this.redo
                }}>
                    <Header />
                    <EditorArea />
                    <LoadSchemeModal onNewScheme={this.initNewScheme} onImportScheme={this.importScheme} />
                    <ExportSchemeModal onExportScheme={this.exportSchemeToFile} />
                    <NotificationsArea />
                </EditorContext.Provider>
            </>
        );
    }
}

App.propTypes = {
    updateScale: PropTypes.func,
    updateMouseCoords: PropTypes.func,
    setMode: PropTypes.func,
    setFilename: PropTypes.func,
    showNotification: PropTypes.func,
    reInitEditor: PropTypes.func,
    showLoadForm: PropTypes.func,
    increaseTactCount: PropTypes.func,
    showTactCounter: PropTypes.func,
    hideTactCounter: PropTypes.func,
    showSchemeControls: PropTypes.func,
    hideSchemeControls: PropTypes.func,
    showContextMenu: PropTypes.func,
    hideContextMenu: PropTypes.func,
    filename: PropTypes.string,
}

const mapStateToProps = state => ({
    filename: state.editor.filename,
});

const mapDispatchToProps = {
    updateScale,
    updateMouseCoords,
    setMode,
    setFilename,
    showNotification,
    reInitEditor,
    showLoadForm,
    increaseTactCount,
    showTactCounter,
    hideTactCounter,
    showSchemeControls,
    hideSchemeControls,
    showContextMenu,
    hideContextMenu
};

export default connect(mapStateToProps, mapDispatchToProps)(App);