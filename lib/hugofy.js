'use babel';
const fs = require("fs");
const spawn = require('child_process').spawn;
const opn = require('opn');
const os = require('os');

let startCmd;

import HugofyView from './hugofy-view';
import {
    CompositeDisposable
} from 'atom';

export default {

    hugofyView: null,
    modalPanel: null,
    subscriptions: null,
    config: {
        theme: {
            type: 'string',
            default: ''
        }
    },
    activate(state) {
        this.hugofyView = new HugofyView(state.hugofyViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.hugofyView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'hugofy:startServer': () => this.startServer(),
            'hugofy:stopServer': () => this.stopServer(),
            'hugofy:newPost': () => this.newPost(),
            'core:confirm': () => this.createFile(),
            'core:cancel': () => this.modalPanel.hide()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.hugofyView.destroy();
    },

    serialize() {
        return {
            hugofyViewState: this.hugofyView.serialize()
        };
    },
    // List existed themes
    setTheme() {
        const projectPath = atom.project.getPaths();
        const projectDirectories = atom.project.getDirectories();
        const themeFolder = path.join(projectPath[0], 'themes');
        // const themeFolder = projectDirectories[0].getSubDirectory('themes')
        fs.readdir(themeFolder, (err, dir) => {

            let themeList = dir;
            if (themeList.length === 0) {
                atom.notifications.addError('No themes available in themes folder')
            } else {

            }
        });
    },
    createFile() {
        const projectPath = atom.project.getPaths();

        const fileName = this.hugofyView.element.querySelector("#fileName").value;
        const folder = this.hugofyView.element.querySelector("#folder").value;

        const newPostPath = path.join(projectPath[0], 'content', folder, fileName);
        const postPath = folder + path.sep + fileName;
        const newPostCmd = spawn('hugo', ['new', postPath, `-s="${projectPath[0]}"`], {
            shell: true
        });
        newPostCmd.stdout.on('data', (data) => {
            atom.notifications.addInfo(data);
        });
        newPostCmd.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        newPostCmd.on('close', (code) => {
            console.log(code);
            if (code === 0) {
                atom.workspace.open(newPostPath)
            } else {}

        });
    },
    startServer() {

        const projectPath = atom.project.getPaths();
        const defaultTheme = atom.config.get('hugofy.theme');
        if (defaultTheme) {
            startCmd = spawn('hugo', ['server', `--theme=${defaultTheme}`, `-s="${projectPath[0]}"`, '--buildDrafts', '--watch', '--port=9082'], {
                shell: true
            });
            startCmd.stdout.on('data', (data) => {
                if (data.indexOf('building sites') > -1) {
                    opn('http://localhost:9082');
                }

                console.log(`stdout: ${data}`);
            });

            startCmd.stderr.on('data', (data) => {
                console.log(data.toString());
                atom.notifications.addError(`Error running server`);
            });

            startCmd.on('close', (code) => {
                console.log('Command close, code = ', code);
            });
        } else {
            atom.notifications.addWarning('Default theme not set. Please set one on package settings');
        }
    },
        stopServer() {
        if (startCmd) {
            if (os.platform() == 'win32') {
                spawn("taskkill", ["/pid", startCmd.pid, '/f', '/t']);
            }
            else {
                startCmd.kill('SIGILL');
            }
        } else {
            console.log('No process started');
        }
    },
    newPost() {
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );

    }

};
