getProfiler = function(v8Profiler, fs) {
  var currentProfiles = {},
      colorize        = function(s) {
        return '\x1b[36m' + s + '\x1b[0m';
      }
  ;

  var startProfile = function(profileName, options) {
    if (currentProfiles[profileName]) {
      return;
    }
    currentProfiles[profileName] = options;

    console.log(colorize('Profiling "' + profileName + '"'));
    v8Profiler.startProfiling(profileName);
  };

  var stopProfile = function(profileName) {
    if (!currentProfiles[profileName] || currentProfiles[profileName].complete) {
      return;
    }
    currentProfiles[profileName].complete = true;

    var profile    = v8Profiler.stopProfiling(profileName),
        exportPath = currentProfiles[profileName].exportPath
    ;

    profile.export(function(error, result) {
      fs.writeFileSync(exportPath, result);
      console.log(colorize('Profile "' + profileName + '" has been written to ' + exportPath));

      profile.delete();
      delete currentProfiles[profileName];
    });
  };

  return {
    startProfile: startProfile,
    stopProfile: stopProfile,
  };
};
