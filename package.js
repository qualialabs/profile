Package.describe({
  name: 'qualia:profile',
  version: '0.0.12',
  summary: 'Profile the Meteor build process, server startup, and server runtime.',
  git: 'http://github.com/qualialabs/profile',
  documentation: 'README.md',
});

if (process.env.QUALIA_PROFILE_FOLDER || process.argv.slice(-1)[0] === 'publish') {
  Package.registerBuildPlugin({
    name: 'qualia:profile',
    sources: ['profile.js', 'plugin.js'],
    npmDependencies: {
      'v8-profiler-node8': '6.0.0',
    },
  });
}

Npm.depends({
  'v8-profiler-node8': '6.0.0',
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.6.1');

  api.use(['ecmascript', 'underscore'], ['server']);

  api.mainModule('main.js', 'server');
});
