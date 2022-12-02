import * as THREE from 'three';
// import easing from './easing.js';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useActivate, useLoaders, usePhysics, useWorld, useDefaultModules, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();

  let removePhysic = false;
  let physicsId = null;
  (async () => {
    const u = `${baseUrl}lantern.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    // const {animations} = o;
    o = o.scene;
    app.add(o);
    
    physicsId = physics.addGeometry(o);
    
    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.castShadows = true;
    app.add(pointLight);
  })();
  
  const frame = useFrame(({timeDiff}) => {
    if (removePhysic && physicsId) {
      physics.removeGeometry(physicsId);
      physicsId = null;
    }
  });
  app.removePhysicsObjects = () => {
    removePhysic = true;
  }
  app.removeSubApps = () => {
    frame.cleanup();
  }
  
  const clean = useCleanup(() => {
    physics.removeGeometry(physicsId);
  });

  return app;
};