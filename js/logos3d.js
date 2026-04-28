(function () {
  "use strict";
  var LOGOS = [
    { id: "logo3d-magna", file: "/logo/magna+logo+3d+model.glb" },
    { id: "logo3d-asphericon", file: "/logo/asphericon+logo+3d+model.glb" },
    { id: "logo3d-preciosa", file: "/logo/preciosa+logo+3d.glb" },
    { id: "logo3d-lukov", file: "/logo/lukov+3d+model.glb" },
  ];
  var isPageVisible = true;
  var instances = [];

  function initLogo(cfg) {
    var container = document.getElementById(cfg.id);
    if (!container) return;
    var w = container.clientWidth || 55;
    var h = container.clientHeight || 55;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0, 0.15, 1.5);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    var dl = new THREE.DirectionalLight(0xfff8e7, 1.0);
    dl.position.set(2, 3, 2);
    scene.add(dl);
    var bl = new THREE.DirectionalLight(0x6b5bce, 0.3);
    bl.position.set(-1, 1, -1);
    scene.add(bl);

    var loader = new THREE.GLTFLoader();
    loader.load(
      cfg.file,
      function (gltf) {
        var model = gltf.scene;
        var box = new THREE.Box3().setFromObject(model);
        var center = box.getCenter(new THREE.Vector3());
        var size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        var scale = 0.65 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        scene.add(model);
        instances.push({
          scene: scene,
          camera: camera,
          renderer: renderer,
          model: model,
          phase: 0,
        });
      },
      undefined,
      function (err) {
        console.warn("Logo load error (" + cfg.id + "):", err);
        container.style.display = "none";
      },
    );
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!isPageVisible) return;
    var t = performance.now() * 0.001;
    for (var i = 0; i < instances.length; i++) {
      var inst = instances[i];
      inst.model.rotation.y =
        -Math.PI / 2 + Math.sin(t * 1.5 + inst.phase) * 0.4; // Додаємо Math.PI / 2 для розвороту на 90 градусів.
      inst.model.rotation.x = Math.sin(t * 1.0 + inst.phase) * 0.15; // Легке погойдування вгору-вниз для об'ємності
      inst.renderer.render(inst.scene, inst.camera);
    }
  }

  document.addEventListener("visibilitychange", function () {
    isPageVisible = !document.hidden;
  });

  window.addEventListener("resize", function () {
    instances.forEach(function (inst) {
      var c = inst.renderer.domElement.parentElement;
      if (!c) return;
      var w = c.clientWidth || 55,
        h = c.clientHeight || 55;
      inst.camera.aspect = w / h;
      inst.camera.updateProjectionMatrix();
      inst.renderer.setSize(w, h);
    });
  });

  LOGOS.forEach(initLogo);
  animate();
})();
