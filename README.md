# Affinity Network Load Tests

Created with K6: [Documentation](https://k6.io/docs/)

## How to use libraries with k6

In order to use external libraries (everything outside k6 module) bundler should be used.

This repo already has webpack set up to create a bundled test (from javascript or typescript).

## How to create and run test locally

1. Create your test script in the `flows` folder (with `.test.js` or `.test.ts` ending)
2. Run `npm run bundle` to get bundled test
3. Run your test. Example:
   ```bash
   k6 run dist/exampleTest.bundle.js --compatibility-mode=base
   ```

Alternatively, you can combine step 2 and 3 with `&&` operator. Example:

```bash
npm run bundle && k6 run dist/exampleTest.bundle.js --compatibility-mode=base
```

## How to work with environment variables

### Manual Solution (Not Recommended)

In order to pass environment variable across all VUs run command should include `-e KEY=VALUE`

To access value in the code `__ENV` variable should be used.
More info can be found [here](https://k6.io/docs/using-k6/environment-variables)

Example run command:

```bash
k6 run -e TEST_OLEG_VARIABLE=OLEG dist/test.bundle.js --compatibility-mode=base
```

Example accessing:

```
console.log('My variable value is:' + __ENV.TEST_OLEG_VARIABLE)
```

### Automated Solution (Recommended)

Since manually passing environment variables using `-e KEY=VALUE` can become cumbersome, another solution uses a bash script (`export-env.sh`) to load the environment variables from the `.env` file (example of `.env` file is described in `.env.example`).

To use it, simply update the `package.json` scripts. Example:

```bash
"cloudWalletE2EFlow": ". ./export-env.sh && npm run bundle && k6 run dist/cloudWalletE2EFlow.bundle.js --compatibility-mode=base --include-system-env-vars"
```

and running `npm run <script>` afterwards. Example:

```bash
npm run cloudWalletE2EFlow
```

> This method is only suited for UNIX-based OS (for Windows use Cygwin/WSL/WSL2). If the solution does not work, you might need to revert to the [Manual Solution](#manual-solution-not-recommended) described above.

## Deploying to CI/CD pipeline

### Settting up variables to run in GitLab CI pipeline
For running test scenario in the CI/CD pipeline, environment variables should be passed:

- To pass new environment variables required, go to the `~/.gitlab-ci.yml` file to add below the `-e` tag, where `~/` refers to project root, not your home directory.
  - e.g. To add a new env variable: `APP_API_KEY`
  - Navigate to `~/.gitlab-ci.yml`
  - Add your new env variable into the run command with an `-e` tag like so:

```
# inside ~/.gitlab-ci.yml
loadtest_job:
   script:
      - eval "k6 run ...
        -e APP_API_KEY=\$${TEST_ENVIRONMENT}_APP_API_KEY
        -e OTHER_ENV_VARIABLE=\$${TEST_ENVIRONMENT}_OTHER_ENV_VARIABLE
        ..."
```

> Note: `SAFETRAVEL_API_KEY` - can be found [here](https://replika.atlassian.net/wiki/spaces/S/pages/280822644/Licence+key+PoC) (for prod - `hp-uva-prod-all` key)

- Ensure you have the `PRODUCTION` (at least), `DEVELOPMENT`, and `STAGING` environment variables specified in Gitlab `variables` (accessible through `Settings`>`CI/CD`>`Variables`), you need `Maintainer` access or higher).
  - You can disable a variable's `Protected` status to enable it to be imported in jobs running in non-protected branches or tags.


### Running Performance Test in GitLab CI pipeline 

The steps to run performance test in GitLab CI is outlined in more detail in this [Confluence Page](https://replika.atlassian.net/wiki/spaces/NETCORE/pages/812908568/Running+Stress+Test+in+GitLab+CI). Essentially it covers:

- Running test in Gitlab CI pipeline: you can run pipeline job through by navigating to `CI/CD`>`Pipelines`>`Run pipeline`, specifying the variables (e.g. `TEST_ENVIRONMENT`, `TEST_SUITE_SCRIPT`, etc) and the branch to run.
- Scheduled test: you can schedule pipeline to run periodically by navigating to `CI/CD`>`Schedules`>`New Schedule` and specifying up the `Variables` based on the ones in the `Run pipeline` above.
## Note

You might notice that some tests are running with `--compatibility-mode=base` key.

If your test is fully ES5 compatible, you can get additional benefits speeding up start time and reducing memory consumption.

More info can be found [here](https://k6.io/docs/using-k6/javascript-compatibility-mode)
