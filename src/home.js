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
const camera = new THREE.PerspectiveCamera (75,
    innerWidth / innerHeight,
    1,
    1000)

camera.position.set(0,40,200)

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
//new OrbitControls(camera,renderer.domElement)

// Model
let obj
const gltfLoader = new GLTFLoader()
gltfLoader.load('./res/solar-panel/scene.gltf', (gltfScene) => {
    obj = gltfScene.scene
    scene.add(gltfScene.scene)
    console.log(gltfScene.scene)

    obj.rotation.x = 0.70
})

// Light
const light = new THREE.HemisphereLight(0xffffff, 0x000000,15)
scene.add(light)

//Animation
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

let onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)

    targetX = mouseX * .005
    targetY = mouseY * -.005
}

// Turning with mouse and Moving Light
document.addEventListener('mousemove', onDocumentMouseMove)

function animate(){
    if(obj != null){
        console.log(obj.rotation.y)
        // Turning with mouse
        targetX = mouseX * .001
        targetY = mouseY * .001

        obj.rotation.y += (targetX - obj.rotation.y)
        obj.rotation.x += (targetY - (obj.rotation.x-0.7))
        obj.rotation.z += (targetY - (obj.rotation.x-0.7))

    }
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}

animate()