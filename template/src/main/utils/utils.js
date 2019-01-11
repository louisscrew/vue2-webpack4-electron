//是否为调试模式 
function isDev() {
    let r = false;
    //获取
    let argvs = process.argv.splice(2);
    if ("--development" == argvs[0]) {
        r = true;
    }
    return r;
}

module.exports = {
    isDev: isDev
}