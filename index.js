import * as THREE from 'three';
// import easing from './easing.js';
import totum from 'totum';
const {useApp, useFrame, useActivate, useLoaders, usePhysics, useWorld, useDefaultModules, useCleanup} = totum;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();

  let physicsIds = [];
  (async () => {
    const u = `${baseUrl}lantern.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    // const {animations} = o;
    o = o.scene;
    app.add(o);
    
    const physicsId = physics.addGeometry(o);
    physicsIds.push(physicsId);
    
    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.castShadows = true;
    app.add(pointLight);
  })();
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return app;
};
