# 3D Kusama Canary Component

![3D Canary Screenshot](./images/canary_001.png)

A React component to render an interactive 3D Kusama Canary built on `react-three-fiber`.

It also supports loading different models and can be changed by given configurations.

## Using

Import the component:

     import ThreeCanary from "@kappasigmamu/canary-component"

Instatiate the component passing the model as attribute along with
the right configurations for the model:

     const config = {
       "nodeCoords": "Baked_GIL_BUSTO003_1.geometry.attributes.position",
       "nodeSigns": [-1, 1, -1],
       "nodeScale": 0.5,
       "nodeGroupScale": 0.1,
       "meshColorIndex": 3,
       "modelMaterial": "MatWireframe",
       "modelScale": 0.2,
       "gridPosition": [0, -0,4, 0],
       "cameraPosition": [-1, 2.5, 4]
     }
     
     <ThreeCanary
       objectUrl={ "/assets/gil.glb" }
       nodes={ this.state.nodesData }
       onNodeClick={ (nodeId) => {
         console.log("onNodeClick", nodeId)}
       }
       config={ config }
     />

If no `config` is given, the components defaults to the Canary model to
keep backward compatibility.

It's also possible to import default configurations for models related
to KSM (e.g. Canary and Gilberto Gil's bust:

     import ThreeCanary, { defaultCanaryConfig} from "@kappasigmamu/canary-component"

     <ThreeCanary
       objectUrl={ "/assets/gil.glb" }
       nodes={ this.state.nodesData }
       onNodeClick={ (nodeId) => {
         console.log("onNodeClick", nodeId)}
       }
       config={ defaultCanaryConfig["gil"] }
     />

Check `./src/index.js` for a complete example on how to use the component.

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
    git commit ...
    git tag 0.x.x
    git push
    npm publish
