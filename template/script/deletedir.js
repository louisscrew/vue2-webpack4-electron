const rimraf = require('rimraf');
const path = require('path');
const rootPath = path.join(__dirname, '..');
const tempAppFoloder = path.join(rootPath, 'tmpdir');
rimraf(tempAppFoloder, function (err) { // 删除当前目录下的 test.txt
    console.log(err);
});