const path = require("path");

module.exports = {
  entry: "./src/main.js",//入口文件，src目录下的index.js文件，
  output: {
    path: path.resolve(__dirname, './dist'),//输出路径，就是新建的dist目录，
    publicPath: '/dist/',
    filename: 'arcgisx.min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
}