var path = require('path');
var fs = require('fs');

function FileSystemService() {
    const DEFAULT_DIR = '/';

    var m_currentDir = DEFAULT_DIR;

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


    return {
        getDir: getDir,
        setDir: setDir,
        listDir: listDir
    }

};

module.exports = FileSystemService;