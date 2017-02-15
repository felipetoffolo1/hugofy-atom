'use babel';
const fs = require("fs");
const spawn = require('child_process').spawn;
// const opn = require('opn');
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
            'hugofy:setTheme': () => this.setTheme(),
            'hugofy:newPost': () => this.newPost()
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
    startServer() {

      const projectPath = atom.project.getPaths();
        const defaultTheme = atom.config.get('hugofy.theme');
        if (defaultTheme) {
            startCmd = spawn('hugo', ['server', `--theme=${defaultTheme}`, `-s="${projectPath[0]}"`, '--buildDrafts', '--watch', '--port=9081'], {
                shell: true
            });
        console.log(startCmd);
        startCmd.stdout.on('data', (data) => {
            if (data.indexOf('building sites') > -1) {
                opn('http://localhost:9081');
            }

            console.log(`stdout: ${data}`);
        });

        startCmd.stderr.on('data', (data) => {
            console.log(data.toString());
            vscode.window.showErrorMessage(`Error running server`);
        });

        startCmd.on('close', (code) => {
            console.log('Command close, code = ', code);
        });
      } else {
        atom.notifications.addWarning('Default theme not set. Please set one on package settings');
      }
    },
//     stopServer() {
//     if (startCmd) {
//         if (os.platform() == 'win32') {
//             spawn("taskkill", ["/pid", startCmd.pid, '/f', '/t']);
//         }
//         else {
//             startCmd.kill('SIGINT');
//         }
//     } else {
//         console.log('No process started');
//     }
// },
newPost() {
  console.log('new post')
  return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
  );
    // vscode.window.showInputBox({ placeHolder: 'Enter filename' }).then((filename) => {
    //     const newPostPath = path.join(vscode.workspace.rootPath, 'content', 'post', filename);
    //     const postPath = 'post' + path.sep + filename;
    //     const newPostCmd = spawn('hugo', ['new', postPath, `-s="${vscode.workspace.rootPath}"`], { shell: true });
    //     newPostCmd.stdout.on('data', (data) => {
    //         vscode.window.showInformationMessage(data);
    //     });
    //     newPostCmd.stderr.on('data', (data) => {
    //         console.log(`stderr: ${data}`);
    //         vscode.window.showInformationMessage(`Error creating new post.`);
    //     });
    //     newPostCmd.on('close', (code) => {
    //         if (code === 0) {
    //             let uripath = vscode.Uri.file(newPostPath);
    //             vscode.workspace.openTextDocument(uripath).then((document) => {
    //                 vscode.window.showTextDocument(document);
    //             }, err => {
    //                 console.log(err);
    //             });
    //         } else {
    //             vscode.window.showErrorMessage(`Error creating new post.`);
    //         }
    //
    //     });
    // });
}

};
