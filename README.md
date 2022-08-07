# @ryan-cha/stats.js

Forked version of [stats.js](https://github.com/mrdoob/stats.js).

- What's different?
  - Shows **Average Line** for MS panel
  - A little bit bigger than the original (size 80x48 -> 100x60)
  - css[position]: fixed -> absolute
  - css[z-index]: 10000 -> 1000
  - MB panel temporarily disabled
- To-do
  - Provide Typescript types
  - Adopt the latest Ecma Script (no more `var`!!!)

---

#### JavaScript Performance Monitor

This class provides a simple info box that will help you monitor your code performance.

- **FPS** Frames rendered in the last second. The higher the number the better.
- **MS** Milliseconds needed to render a frame. The lower the number the better.
- **MB** MBytes of allocated memory. (Run Chrome with `--enable-precise-memory-info`)
- **CUSTOM** User-defined panel support.

### Screenshots

![fps.png](https://raw.githubusercontent.com/mrdoob/stats.js/master/files/fps.png)
![ms.png](https://raw.githubusercontent.com/mrdoob/stats.js/master/files/ms.png)
![mb.png](https://raw.githubusercontent.com/mrdoob/stats.js/master/files/mb.png)
![custom.png](https://raw.githubusercontent.com/mrdoob/stats.js/master/files/custom.png)

### Installation

```bash
npm install @ryan-cha/stats.js
```

### Usage

```javascript
var stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // monitored code goes here

  stats.end();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```
