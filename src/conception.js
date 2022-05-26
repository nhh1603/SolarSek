import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// dat.gui
const gui = new dat.GUI()
const world = {}

dat.GUI.toggleHide()

// Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000)

// Camera
const camera = new THREE.PerspectiveCamera (30,
    innerWidth / innerHeight,
    1,
    1000)

camera.position.set(0.5,1,1.5)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

addEventListener('resize', () => {
    renderer.setSize(innerWidth,innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
})

// Orbit Control
new OrbitControls(camera,renderer.domElement)

// Model
let obj
const gltfLoader = new GLTFLoader()
gltfLoader.load('./res/project/SolarSekModel.gltf', (gltfScene) => {
    obj = gltfScene.scene
    scene.add(gltfScene.scene)
    console.log(gltfScene.scene)

    obj.rotation.x = 1.5
})


// Light
const skyLight = new THREE.HemisphereLight(0xffffff, 0x000000,1)
scene.add(skyLight)

//Animation


function animate(){
    if(obj != null){
        console.log(obj.rotation.y)
        obj.rotation.z += 0.01
    }
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}

animate()