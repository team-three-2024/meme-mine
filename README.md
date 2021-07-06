# 3D Kusama Canary Component

![3D Canary Screenshot](./images/canary_001.png)

A React component to render an interactive 3D Kusama Canary.

## Developing

Make sure you have latest stable Node.js installed (see `nvm`):

    git clone git@github.com:KappaSigmaMu/canary-component.git
    cd canary-component/
    npm install

Start development mode:

    npm run start

That should bring you to `http://localhost:3000` with a hot-reload React app.
Edit files at `src/` to see live updates.

## Todo

Web:

- [x] Experiment with the 3D obj file rendering in three.js with shaders
- [x] Refactor and move three.js experiments to this repos
- [x] Make it a React component
- [x] Check with Alan/Lauro what kind of data we get from Kusama
- [ ] Make 3D Canary nodes interactive
- [ ] Randomly distribute interactive nodes
  - Maybe only in the head
- [ ] Implement something like the effect from https://threejs.org/examples/#webgl_video_kinect (Lauro's suggestion)

3D model:

- [ ] Clean up mesh vertices on feet
- [ ] Add more vertices to legs