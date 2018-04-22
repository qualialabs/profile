# Profile

This package makes it easy to record proper sampling [CPU profiles](https://github.com/node-inspector/v8-profiler) of Meteor on the server. You can open the profile in Chrome for detailed analysis. A CPU profile looks like this in Chrome:

![example flamechart](https://cdn.pbrd.co/images/HhIkDVZ.png)

This package supports profiling both the Meteor build process and the Meteor server process.

## Installation

```sh
$ meteor add qualia:profile
```

## Usage

There are two uses of `qualia:profile`. The first is for profiling Meteor build and reload performance. The second is for profiling Meteor runtime performance.

#### Build Profiling

To enable profiling Meteor builds, just run you application with the environment variable `QUALIA_PROFILE_FOLDER` set to the folder where you'd like the CPU profiles to be saved. For example, you might start your application like:

```sh
QUALIA_PROFILE_FOLDER=/path/to/profiles meteor
```

Once this environment variable is set, four different kinds of profiles will be saved to that folder.
  1. `initial-build.cpuprofile` profiles the build process the very first time it is run.
  2. `full-rebuild.cpuprofile` profiles the build process when at least one server-side file has changed.
  3. `client-rebuild.cpuprofile` profiles the build process when only client-side files have changed. Meteor has a fast track for this scenario.
  4. `startup.cpuprofile` profiles the server process as it boots up.

When trying to figure out why your app takes so long to build/rebuild, it is important to look at all 4 of these different profiles. You should also play around with which files you are using to trigger reloads. Meteor packages rebuild somewhat independently.

#### Runtime Profiling

To profile the Meteor server at runtime, open the Meteor shell and run the following commands:

```sh
import Profiler from "meteor/qualia:profile";

let profileName = 'myprofile';
let profilePath = '/path/to/profiles/myprofile.cpuprofile';
let profileMS = 10000;

Profiler.profileDuration(profileName, profilePath, profileMS);
```

This will profile your code for ten seconds and save the profile to `/path/to/profiles/myprofile.cpuprofile`.

You can call `Profiler.profileDuration` from anywhere in your code, but it is often convenient to call it from the Meteor shell. If you enable the [Meteor shell in prod](https://github.com/qualialabs/prod-shell), you can profile live production code.


## Reading Profiles

Chrome's javascript profiler is hidden by default. To enable it first open the DevTools main menu:

![devtools main menu](https://developers.google.com/web/tools/chrome-devtools/images/main-menu.svg)

After that, select **More tools > JavaScript Profiler**. The old profiler opens in a new panel called **JavaScript Profiler**. For more information reference [this article](https://developers.google.com/web/updates/2016/12/devtools-javascript-cpu-profile-migration#old).

Once the javascript profiler is enabled click **Load** to load your `*.cpuprofile` files. You can now navigate between your uploaded CPU profiles by using the sidebar on the left hand side.

For guidance on how to interpret these profiles, [this tutorial](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/js-execution) is a good first step.
