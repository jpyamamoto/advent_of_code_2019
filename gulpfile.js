var { src, parallel, dest } = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

function assets() {
    return src(['./src/**/*', '!./**/*.ts']).pipe(dest('dist'));
}

function typescript() {
    return tsProject.src().pipe(tsProject()).js.pipe(dest('dist'));
}

exports.default = parallel(assets, typescript);
