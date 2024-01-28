# A game using ThreeJS for Global Game Jam 2024

[PLAY LATEST VERSION HERE!](https://deploy-preview-10--stupendous-sorbet-30f8e2.netlify.app/)

## Developing

Make sure you have Node.js >= v18.15.0 installed (see `nvm`):

    npm install

Start development mode:

    npm run start

That should bring you to `http://localhost:3000` with a hot-reload React app.

Edit files at `src/` to see live updates.

## Gameplay

The gameplay so far is very simple.
- Press left or right arrows to switch lanes in 3D mode
- Press space bar to switch to 2D mode
- Press up arrow to jump

## Production build

    npm run build
    git commit ...
    git tag 0.x.x
    git push
    npm publish
