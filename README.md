# canvas-lazy-update
Make some parallelized computations and work, while part of the scene is drawn synchronously with transformation. After these computations are done, redraw the scene.

# See it alive
```bash
npm i
```
```bash
npm start
```

# What is the key
- Using webworker to calculate some points of explicit math function graph
- Send the data back to the main thread and store it to Path2D instance
- Store it in path (the Path2D instance) property of Func class instance
- This class represents explicit functions, you can add points and implicit function
- To Do that you have to define "draw", "update" function to any new GraphUtils.js class

# Contribute
Every geek is welcom, help ake the performance rise to the sky.

# License
MIT
