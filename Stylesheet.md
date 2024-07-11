# Stylesheet

## Optimization

*Supporting Documentation*:https://www.electronjs.org/docs/latest/tutorial/performance


### 1. DO NOT CARELESSLY INCLUDE MODULES
     - some packages are very bloated and can affect performance and download times
     - we should consistently check for bottlenecking and performance issues throughout the apps's life cycle
     - Make sure to not start the application too soon in the loading process

> Checking for Optimization

Check the following:

1. the size of dependencies included
2. the resources required to load it
3. the resources required to perform the action you're interested in

Generating a CPU profile and a heap memory profile ofr loading a module can be done with a single command on the command line. In the example below, we're looking at `request`

```
node --cpu-prof --heap-prof -e "require('request')"
```

This will generate 2 profile files to help visualize memory consumption. You should see a `.cpuprofile` file, and a `.heapprofile` file in the directory the command is executed in. Both files can be analyzed using the Chrome Dev tools, using the `Performance` and `Memory` tabs.

![Performance Example Image](https://www.electronjs.org/assets/images/performance-cpu-prof-ac389f8f3dfd6fbcb08245a6d02f346f.png)

![Memory Example Image](https://www.electronjs.org/assets/images/performance-heap-prof-97e432676b7357425aa67f73eeef0d1f.png)


### 2. DO NOT RUN COMMANDS TOO EARLY

It is common to want to have all our imports at the top and just carelessly invoke functions. We want to avoid doing that here, as memory and space are precious.

Here is a *BAD* example of running a parsing function too early:

```js
const fs = require('node:fs')
const fooParser = require('foo-parser')

class Parser {
  constructor () {
    this.files = fs.readdirSync('.')
  }

  getParsedFiles () {
    return fooParser.parse(this.files)
  }
}

const parser = new Parser()

module.exports = { parser }
```

We are importing and running the function, as well as reading the `foodParser` file too early. It may not be needed on application start up, and we may not need to parse it right away. We can adjust this as so:

*GOOD* Example:

```js
// "fs" is likely already being loaded, so the `require()` call is cheap
const fs = require('node:fs')

class Parser {
  async getFiles () {
    // Touch the disk as soon as `getFiles` is called, not sooner.
    // Also, ensure that we're not blocking other operations by using
    // the asynchronous version.
    this.files = this.files || await fs.promises.readdir('.')

    return this.files
  }

  async getParsedFiles () {
    // Our fictitious foo-parser is a big and expensive module to load, so
    // defer that work until we actually need to parse files.
    // Since `require()` comes with a module cache, the `require()` call
    // will only be expensive once - subsequent calls of `getParsedFiles()`
    // will be faster.
    const fooParser = require('foo-parser')
    const files = await this.getFiles()

    return fooParser.parse(files)
  }
}

// This operation is now a lot cheaper than in our previous example
const parser = new Parser()

module.exports = { parser }

```

### 3. DO NOT BLOCK THE MAIN PROCESS

Electron's main process is the parent process to all other processes. Blocking this with long-running operations is *NEVER* allowed. The main process and its UI thread are the control tower for all operations int he app. Electron and Chromium are careful to put heavy disk I/O and CPU-Bound operations onto new threads to avoid blocking the UI thread.

To achieve this:

1. For long runniung CPI-heavy tasks, make use of worker threads (https://nodejs.org/api/worker_threads.html), consider moving them to the BrowserWindow, or (as a last resort) spawn a dedicated process.

2. Avoid using the synchronous IPC and the `@electron/remote` module as much as possible.

3. Avoid using blocking I/O operations in the main process. In short, whenever core `Node.js` modules, like `fs` or `child_process, offer a synchronour or an asynchrnous version, you should prefer the asynchronous and non-blocking variant.

### 4. Blocking the renderer process

Orchestrating the flow of operations in the renderer's code is particularly useful if users complain about the app sometimes "stuttering"

The two primary tools to use are `requestIdleCallback()` for small operations, and `Web Workers` for long-running operations

- `requestIdleCallback()`: allows devs to queue up a function to be executed as soon as the prcess is entering an idle period. It enables you to perform low-prority or background work without impaching the user experience. MDN: (https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

- `Web Workers` - powerful tool to run code on a seperate thread. There are some caveats to consider. Electron has some multithreading documentation (https://www.electronjs.org/docs/latest/tutorial/multithreading) and MDN has docs on Web Workers (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). These are an ideal solution for an operation that requires a lot of CPU power for an extended period of time.


### 4. Bundle

`require()` can be an expensive operation over time, and we need to account for this. In order avoid having to manage multiple files in production, we can quickly solve this problem by `Bundleing` the code into one single file. We can achieve this using `WebPack`, `Parcel` or `rollup.js`
