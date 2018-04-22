var fs          = Npm.require('fs'),
    path        = Npm.require('path'),
    outputPath  = path.resolve(process.env.QUALIA_PROFILE_FOLDER),
    mainModule  = global.process.mainModule,
    absPath     = mainModule.filename.split(path.sep).slice(0, -1).join(path.sep),
    require     = function(filePath) {
      return mainModule.require(path.resolve(absPath, filePath));
    },
    AppRunner   = require('./runners/run-app.js').AppRunner,
    Bundler     = require('./isobuild/bundler.js'),
    v8Profiler  = Npm.require('v8-profiler-node8'),
    Profiler    = getProfiler(v8Profiler, fs)
;

if (!AppRunner._patched) {
  AppRunner._patched = true;

  var oldMakePromise = AppRunner.prototype._makePromise;
  AppRunner.prototype._makePromise = function(name) {
    if (name === 'run') {
      Profiler.stopProfile('client-rebuild');
    }
    return oldMakePromise.apply(this, arguments);
  };

  var oldResolvePromise = AppRunner.prototype._resolvePromise;
  AppRunner.prototype._resolvePromise = function(name, value) {
    let outcome = value ? value.outcome : '';

    if (name === 'run' && outcome === 'changed') {
      Profiler.startProfile('full-rebuild', {
        exportPath: path.join(outputPath, 'full-rebuild.cpuprofile'),
      });
    }
    if (name === 'run' && outcome === 'changed-refreshable') {
      Profiler.startProfile('client-rebuild', {
        exportPath: path.join(outputPath, 'client-rebuild.cpuprofile'),
      });
    }
    else if (name === 'start') {
      Profiler.stopProfile('initial-build');
      Profiler.stopProfile('full-rebuild');
    }

    return oldResolvePromise.apply(this, arguments);
  };

  Bundler._mainJsContents = [
    "process.argv.splice(2, 0, 'program.json');",
    "process.chdir(require('path').join(__dirname, 'programs', 'server'));",
    "",
    "var npmRequire = require('./programs/server/npm-require.js').require;",
    "var profilerPath = '/node_modules/meteor/qualia:profile/node_modules/v8-profiler-node8';",
    "var v8Profiler = npmRequire(profilerPath);",
    "var fs = require('fs');",
    'var Profiler = eval(`(' + getProfiler.toString() + ')`)(v8Profiler, fs);',
    "Profiler.startProfile('startup', { exportPath: '" + path.join(outputPath, 'startup.cpuprofile') + "' });",
    "",
    "require('./programs/server/boot.js');",
    "",
    "var intervalID = setInterval(() => {",
    "  if (__meteor_bootstrap__.startupHooks) return;",
    "  clearInterval(intervalID);",
    "  Profiler.stopProfile('startup');",
    "}, 100);",
  ].join("\n");

  Profiler.startProfile('initial-build', {
    exportPath: path.join(outputPath, 'initial-build.cpuprofile'),
  });
}
