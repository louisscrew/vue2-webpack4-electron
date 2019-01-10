const path = require('path');//引用path模块
const gulp = require('gulp'); //加载gulp模块


const electron = require('electron');

gulp.task('development-app',function(){
    
    childProcess.spawn(electron, ['..','--development'], { stdio: 'inherit' });
});


