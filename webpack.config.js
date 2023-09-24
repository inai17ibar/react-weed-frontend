const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index', // 読み込むファイル
    output: {
        path: path.resolve(__dirname, 'public'), //アウトプット先
        filename: 'bundle.js' //アウトプットするファイル名
    }
};