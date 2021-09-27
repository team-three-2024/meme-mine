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

## Production build

    npm run build

## Todo

Web:

- [x] Experiment with the 3D obj file rendering in three.js with shaders
- [x] Refactor and move three.js experiments to this repos
- [x] Make it a React component
- [x] Check with Alan/Lauro what kind of data we get from Kusama
- [x] Make 3D Canary nodes interactive
- [x] Randomly distribute interactive nodes
  - Maybe only in the head
- Styling
  - [ ] Read brand colors as input (so we can pass it along from `ksm-app`)
  - [ ] Implement something like the effect from https://threejs.org/examples/#webgl_video_kinect (Lauro's suggestion)
  - [ ] Add back shaders for styling vertices and meshes
  - [ ] Interpolate points between different shapes (sphare, cube, etc)
  - [ ] Animate points
- [ ] Create KSM NPM organization
- [ ] Publish as NPM package

3D model:

- [ ] Clean up mesh vertices on feet
- [ ] Add more vertices to legs
- [ ] Test loading static/animated glTF files (glb, binary)

- Use spheres instead of cubes on nodes
- User smaller nodes
- Try to interpolate between flying model and static model
- Add better interaction to nodes