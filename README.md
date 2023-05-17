# f9-fields
Powerapps Component Framework Form Fields based on Fluent UI 9


## Modifications to PCF Scripts
This packages requires a modification to pcf-scripts, and suggests an optional one as well.

### Feature Flags (required)
The common OnChange and OnSelect events stopped working for PCF Components while creating this packages.  To get around this, you need to enable events in the feature flags file.

./node_modules/pcf-scripts/featureFlags.json
```json
  "pcfAllowEvents": "on"
```

### StartTask.js
This package contains multiple controls.  While multiple controls does not seem to be supported officially, the only shortcoming seems to be the ability to specify which control gets launched when using `npm start \[watch\]`.  To address this, you can do the following:

./node_modules/pcf-scripts/tasks/startTask.js

Add this at the beginning somewhere (such as line 7, just after the path import):
```js
const argv = require("yargs").argv;
```

and modify the `const outputDir` assignment in the `return` block in the `run` method of `class StartHarnessTask`:
```js
const outputDir = path.join(outDir, (argv.control && controls.includes(argv.control)) ? argv.control : controls[0]);
```