import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";


const axis = new THREE.Vector3(1,0,1).normalize();
const speed = 0.01

// dat.gui
const gui = new dat.GUI()
const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 60,
        heightSegments: 60,
        depthIntensity: 4
    }
}
gui.add(world.plane, 'width', 1, 500).onChange(() => {generatePlane(world.plane.depthIntensity)})
gui.add(world.plane,'height',1,500).onChange(() => {generatePlane(world.plane.depthIntensity)})
gui.add(world.plane,'widthSegments',1,200).onChange(() => {generatePlane(world.plane.depthIntensity)})
gui.add(world.plane,'heightSegments',1,200).onChange(() => {generatePlane(world.plane.depthIntensity)})
gui.add(world.plane, 'depthIntensity',0, 5, 0.05).onChange(() => {generatePlane(world.plane.depthIntensity)})

// Toggle Dat Gui
dat.GUI.toggleHide();

// Ray Caster
const rayCaster = new THREE.Raycaster();

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75,
    innerWidth / innerHeight,
    1,
    1000)


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
camera.position.z = 50

// Box
const boxGeometry = new THREE.BoxGeometry(1,1,1)

const material = new THREE.MeshBasicMaterial({color: 0x00ff})

const mesh = new THREE.Mesh(boxGeometry,material)

//scene.add(mesh)



// Plane
const planeGeometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,
    world.plane.widthSegments,world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true,
    shininess: 50,
    specular: 0x66ffb3,
    refractionRatio: 0.1,
    reflectivity: 0.1
})
const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial)

scene.add(planeMesh)

// Depth
function generatePlane(depthIntensity){
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,
        world.plane.widthSegments,world.plane.heightSegments)


    const { array } = planeMesh.geometry.attributes.position
    const randomValue = []

    // Vertices position randomization
    for (let i = 0; i < array.length; i += 3){
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]

        array[i] = x + (Math.random() - 0.5) * 3
        array[i+1] = y + (Math.random() - 0.5) * 3
        array[i+2] = z + (Math.random()-0.5)*depthIntensity

        randomValue.push(Math.random() * Math.PI * 2)
        randomValue.push(Math.random() * Math.PI * 2)
        randomValue.push(Math.random() * Math.PI * 2)
    }

    planeMesh.geometry.attributes.position.randomValue = randomValue
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

    // Color addition
    const colors = []

    for (let i = 0; i<planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0,0.15,0.3)
    }
    planeMesh.geometry.setAttribute('color',
        new THREE.BufferAttribute(new Float32Array(colors), 3))


}
generatePlane(world.plane.depthIntensity)

// Create Vertex Color




//Light
//const light = new THREE.DirectionalLight(0xffe680, 1)
const light = new THREE.DirectionalLight(0xb3b3b3, 1)
light.position.set(1,1,1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xff99ff, 1)
backLight.position.set(1,-1,-2)
scene.add(backLight)


const backupLight = new THREE.DirectionalLight(0x53ff1a,0.5)
backupLight.position.set(-0.5,0.5,1.5)
scene.add(backupLight)

const backupLight2 = new THREE.DirectionalLight(0x3366ff,0.5)
backupLight.position.set(0.5,-0.5,-1.5)
scene.add(backupLight2)


// Animation

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

    //light.position.setX(targetX)
    //light.position.setY(targetY)

    if(Math.abs(targetX)-Math.abs(targetY) >= 0){
        //light.position.setZ(1 / (1 + Math.abs(targetX)/15) )
    }else{
        //light.position.setZ(1 / (1 + Math.abs(targetY)/15) )
    }

}

// Turning with mouse and Moving Light
document.addEventListener('mousemove', onDocumentMouseMove)

const mouse = {
    x: undefined,
    y: undefined
}

let frame = 0
const rotationX = (Math.random()-0.5)*0.02
const rotationY = (Math.random()-0.5)*0.001
const rotationZ = (Math.random()-0.5)*0.02

function animate() {

    // Turning with mouse
    targetX = mouseX * .001
    targetY = mouseY * .001

    //planeMesh.rotation.y += (.015 * (targetX - planeMesh.rotation.y)*0+0.05)
    planeMesh.rotation.x += (.015 * (targetY - planeMesh.rotation.x)*0+rotationX)
    planeMesh.rotation.z += (.015 * (targetY - planeMesh.rotation.x)*0+rotationZ)


    planeMesh.rotation.y += rotationY



    // Rendering & Ray Casting
    requestAnimationFrame(animate)
    renderer.render(scene,camera)

    rayCaster.setFromCamera(mouse,camera)
    frame += 0.01

    const { array, originalPosition, randomValue } = planeMesh.geometry.attributes.position
    for (let i = 0; i<array.length; i += 3) {
        // x
        array[i] = originalPosition[i] + Math.cos(frame + randomValue[i]) * 0.01
        // y
        array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValue[i+1]) * 0.01
    }
    planeMesh.geometry.attributes.position.needsUpdate = true

    const intersects = rayCaster.intersectObject(planeMesh)

    if(intersects.length > 0){

        const { color } = intersects[0].object.geometry.attributes

        color.setX(intersects[0].face.a, 0.1)
        color.setY(intersects[0].face.a, 0.5)
        color.setZ(intersects[0].face.a, 1)

        color.setX(intersects[0].face.b, 0.1)
        color.setY(intersects[0].face.b, 0.5)
        color.setZ(intersects[0].face.b, 1)

        color.setX(intersects[0].face.c, 0.1)
        color.setY(intersects[0].face.c, 0.5)
        color.setZ(intersects[0].face.c, 1)

        color.needsUpdate = true

        const initialColor = {
            r: 0,
            g: .19,
            b: .4
        }

        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }

        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setY(intersects[0].face.a, hoverColor.g)
                color.setZ(intersects[0].face.a, hoverColor.b)

                color.setX(intersects[0].face.b, hoverColor.r)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setZ(intersects[0].face.b, hoverColor.b)

                color.setX(intersects[0].face.c, hoverColor.r)
                color.setY(intersects[0].face.c, hoverColor.g)
                color.setZ(intersects[0].face.c, hoverColor.b)
            }
        })
    }

}

animate()

addEventListener('mousemove',(event)=>{
    mouse.x = ( event.clientX / innerWidth ) * 2 - 1
    mouse.y = -( event.clientY / innerHeight ) * 2 + 1

    //console.log(mouse)
})

mongoose.connect(
    `mongodb+srv://nhh1603:Hnh.16032002@cluster0.ludh51u.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (!err) {
            console.log("DB connected!");
        } else {
            console.error(err);
        }
    }
);