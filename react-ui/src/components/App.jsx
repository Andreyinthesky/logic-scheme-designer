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
    showContextMenu,
    hideContextMenu
} from "../redux/actions";
import { connect } from "react-redux";

import LoadSchemeForm from "./LoadSchemeForm";
import ExportSchemeForm from "./ExportSchemeForm";
import Header from "./Header";
import EditorArea from "./EditorArea";
import { EditorContext } from "../contexts/editorContext";
import SchemeEditor from "../model/SchemeEditor";
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
            this.saveEditorState();
        }

        this.tryRestoreEditorState() || this.props.showLoadForm();
    }

    bindEditorEvents = (editor) => {
        editor.onWheel = (evt) => {
            const { deltaY } = evt;

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
            } else {
                this.props.showTactCounter();
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

        // document.addEventListener("keydown", (evt) => {
        //     if (evt.code === "KeyZ" && !evt.repeat && evt.target === document.body)
        //         console.log(evt.code, evt.ctrlKey, evt.currentTarget, evt.target);
        // })
    }

    initNewScheme = () => {
        this.editor.restart();
        localStorage.removeItem("editorState");
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

    importScheme = (schemeData) => {
        this.editor.importScheme(schemeData);
    }

    exportSchemeToFile = (filename) => {
        const schemeData = this.editor.exportScheme(filename);
        const file = new Blob([JSON.stringify(schemeData)], { type: "application/json" });

        // MS browsers
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, `${schemeData.name}.json`);
        }
        else {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(file);
            link.download = schemeData.name;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }

        this.props.showNotification({ message: "Схема успешно экспортирована", type: "success" });
    }

    tryRestoreEditorState = () => {
        const editorState = JSON.parse(localStorage.getItem("editorState"));
        const timeout = 15 * 60 * 1000;
        const passed = Math.abs(new Date(editorState.timeStamp) - Date.now());

        if (passed >= timeout) {
            localStorage.removeItem("editorState");
            return false;
        } else {
            this.editor.restoreState(editorState);
            this.props.setFilename(editorState.scheme.name);
            return true;
        }
    }

    saveEditorState = () => {
        const editorState = {
            mode: this.editor.getMode(),
            scale: this.editor.getScale(),
            filename: this.props.filename
        };
        editorState.scheme = this.editor.exportScheme(editorState.filename);
        editorState.timeStamp = Date.now();

        localStorage.setItem("editorState", JSON.stringify(editorState));
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
                    setModeCallback: this.setMode,
                    doTactCallback: this.evaluateScheme,
                    discardInputsCallback: this.discardInputs,
                    setScaleCallback: this.setScale,
                    undoEditorActionCallback: this.undo,
                    redoEditorActionCallback: this.redo
                }}>
                    <Header />
                    <EditorArea />
                    <LoadSchemeForm onNewScheme={this.initNewScheme} onImportScheme={this.importScheme} />
                    <ExportSchemeForm onExportScheme={this.exportSchemeToFile} />
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
    showContextMenu,
    hideContextMenu
};

export default connect(mapStateToProps, mapDispatchToProps)(App);