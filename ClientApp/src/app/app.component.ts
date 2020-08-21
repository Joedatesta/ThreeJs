import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as DAT from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';
  scene: THREE.Scene;
  spriteBehindObject: any; 
  
  ngOnInit(): void {
    this.scene = this.init();
  }

  init () {
    var scene = new THREE.Scene();
    var gui = new DAT.GUI();
    var annotation:any = document.querySelector(".annotation");

    var sphereMaterial = this.getStandardMaterial(0xffffff);
    var sphere = this.getSphere(sphereMaterial, 1, 24);

    var planeMaterial = this.getStandardMaterial(0xffffff);
    var plane = this.getPlane(planeMaterial, 30);

    var leftLight = this.getSpotLight(1, 'rgb(255, 220, 100)');
    var rightLight = this.getSpotLight(1, 'rgb(255, 220, 100)');

    sphere.position.y = sphere.geometry.parameters.radius;
    plane.rotation.x = Math.PI/2;

    leftLight.position.x = -5;
    leftLight.position.y = 2;
    leftLight.position.z = -4;

    rightLight.position.x = 5;
    rightLight.position.y = 2;
    rightLight.position.z = -4;

    var loader = new THREE.TextureLoader();
    planeMaterial.map = loader.load("/concrete.jpg");

    var numberTexture = new THREE.CanvasTexture(
      document.querySelector("#webgl")
    );

    var spriteMaterial = new THREE.SpriteMaterial({
      map: numberTexture,
      alphaTest: 0.5,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(250, 250, 250);
    sprite.scale.set(60, 60, 1);

    var folder1 = gui.addFolder('light_1');
    folder1.add(leftLight, 'intensity', 0, 10);
    folder1.add(leftLight.position, 'x', -5, 15);
    folder1.add(leftLight.position, 'y', -5, 15);
    folder1.add(leftLight.position, 'z', -5, 15);

    var folder2 = gui.addFolder('light_2');
    folder2.add(rightLight, 'intensity', 0, 10);
    folder2.add(rightLight.position, 'x', -5, 15);
    folder2.add(rightLight.position, 'y', -5, 15);
    folder2.add(rightLight.position, 'z', -5, 15);

    var folder3 = gui.addFolder('materials');
    folder3.add(sphereMaterial, 'roughness', 0, 1);
    folder3.add(planeMaterial, 'roughness', 0, 1);
    folder3.add(sphereMaterial, 'metalness', 0, 1);
    folder3.add(planeMaterial, 'metalness', 0, 1);

    var params = {
      modelcolor: "#ffffff"
    };

    folder3.addColor(params, 'modelcolor')
      .name('Model Color')
      .onChange(function(){
        sphereMaterial.color.set(params.modelcolor);
      });
    folder3.add(sphere.position, 'x', 0, 10);
    folder3.add(sphere.position, 'z', 0, 10);
    folder3.open();

    scene.add(sphere);
    scene.add(plane);
    scene.add(leftLight);
    scene.add(rightLight);
    scene.add(sprite);

    var camera = new THREE.PerspectiveCamera(
      45, // field of view
      window.innerWidth / window.innerHeight, // aspect ratio
      1, // near clipping plane
      1000 // far clipping plane
    );
    camera.position.z = 7;
    camera.position.x = -2;
    camera.position.y = 7;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl').appendChild(renderer.domElement);
    
    var controls = new OrbitControls( camera, renderer.domElement );
    
    this.animate(renderer, scene, camera, controls, sprite, sphere, annotation);

    return scene;
  }

  
  getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
  
    return obj;
  }
  
  getStandardMaterial(color) {
    var materialOptions = {
      color: color,
    };
      
    return new THREE.MeshStandardMaterial(materialOptions);
  }
  
  getSpotLight(intensity, color) {
    color = color === undefined ? 'rgb(255, 255, 255)' : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;
  
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 2048;  // default: 512
    light.shadow.mapSize.height = 2048; // default: 512
    light.shadow.bias = 0.001;
  
    return light;
  }
  
  getPlane(material, size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    var obj = new THREE.Mesh(geometry, material);
    obj.receiveShadow = true;
  
    return obj;
  }
  
  animate(renderer, scene, camera, controls, sprite, sphere, annotation) {
    controls.update();
    this.render(renderer, scene, camera, sprite, sphere, annotation);
    requestAnimationFrame(() => this.animate(renderer, scene, camera, controls, sprite, sphere, annotation));
  }

  render(renderer, scene, camera, sprite, sphere, annotation) {
    renderer.render(scene, camera);
    this.updateAnnotationOpacity(camera, sprite, sphere);
    this.updateScreenPosition(renderer, camera, annotation);
  }

  updateAnnotationOpacity(camera, sprite, sphere) {
    var meshDistance = camera.position.distanceTo(sphere.position);
    var spriteDistance = camera.position.distanceTo(sprite.position);
    this.spriteBehindObject = spriteDistance > meshDistance;
    sprite.material.opacity = this.spriteBehindObject ? 0.25 : 1;

    // Do you want a number that changes size according to its position?
    // Comment out the following line and the `::before` pseudo-element.
    sprite.material.opacity = 0;
  }

  updateScreenPosition(renderer, camera, annotation) {
    var vector = new THREE.Vector3(250, 250, 250);
    var canvas = renderer.domElement;

    vector.project(camera);

    vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
    vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

    annotation.style.top = `${vector.y}px`;
    annotation.style.left = `${vector.x}px`;
    annotation.style.opacity = this.spriteBehindObject ? 0.25 : 1;
  }
}
