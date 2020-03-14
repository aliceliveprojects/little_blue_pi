var path = require('path');
var fs = require('fs');

function FileSystemService() {
    const DEFAULT_DIR = '/home/pi/Documents/github/little_blue_pi/little_blue_pi/documentation/';
    const DEFAULT_FILE = 'heart_rate.csv';

    var m_currentDir = DEFAULT_DIR;
    var m_currentFile = DEFAULT_FILE;

    async function _dir(path) {
        var result = [];
        try {
            const dir = await fs.promises.opendir(path);
            for await (const dirent of dir) {
                result.push({
                    m: dirent.name,
                    d: dirent.isDirectory() ? 1 : 0
                })
            }
        } catch (e) {
            // I wanted to send an error here, but I can't seem to send one up to the client.
            console.log("path not found, but returning empty.")
        }
        return result;
    }

    function getDir() {
        return m_currentDir;
    }

    function setDir(path) {

        var item = fs.lstatSync(path) //throws

        if (item.isDirectory(path)) {
            m_currentDir = path;
        } else {
            throw ("not a directory: " + path);
        }

    }

    function listDir() {
        return _dir(m_currentDir);
    }

    function getFile() {
        return m_currentFile;
    }

    function setFile(name) {
        m_currentFile = name;
    }

    function getPath() {
        var result = null;
        try {
            var thepath = path.format({
                dir: m_currentDir,
                base: m_currentFile
            });
            result = path.normalize(thepath);

        } catch (e) {
            console.log("path construction failed.");
        }
        return result;

    }

    function getFileSize() {
        var result = 0;
        var path = getPath();

        if (!!path) {
            var stats = fs.statSync(path);
            result = stats["size"];
        }

        return result;
    }



    return {
        getDir: getDir,
        setDir: setDir,
        listDir: listDir,
        setFile: setFile,
        getFile: getFile,
        getPath: getPath,
        getFileSize: getFileSize
    }

};

module.exports = FileSystemService;