Package.describe({
  name: 'qualia:profile',
  version: '0.0.1',
  summary: 'Profile the Meteor build process, server startup, and server runtime.',
  git: 'http://github.com/qualialabs/profile',
  documentation: 'README.md'
});

if (process.env.QUALIA_PROFILE_FOLDER) {
  Package.registerBuildPlugin({
    name: "qualia:profile",
    use: [],
    sources: [
      'profile.js',
      'plugin.js',
    ],
    npmDependencies: {
      'v8-profiler-node8': "5.7.7",
    }
  });
}

Npm.depends({
  'v8-profiler-node8': "5.7.7",
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.4');

  api.use([
    'ecmascript',
    'underscore',
  ]);

  api.mainModule('main.js');
});
