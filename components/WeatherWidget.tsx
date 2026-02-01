"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import styles from './WeatherWidget.module.css';

export default function WeatherWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dateTime, setDateTime] = useState('');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const [weatherData, setWeatherData] = useState<{
    temp: number;
    city: string;
    description: string;
    icon: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Weather Code to Text/Icon mapping
  const getWeatherInfo = (code: number) => {
    if (code === 0) return { desc: 'Açık', icon: '☀️' };
    if (code >= 1 && code <= 3) return { desc: 'Parçalı Bulutlu', icon: '⛅' };
    if (code >= 45 && code <= 48) return { desc: 'Sisli', icon: '🌫️' };
    if (code >= 51 && code <= 55) return { desc: 'Çiseleme', icon: '🌦️' };
    if (code >= 61 && code <= 67) return { desc: 'Yağmurlu', icon: '🌧️' };
    if (code >= 71 && code <= 77) return { desc: 'Karlı', icon: '❄️' };
    if (code >= 80 && code <= 82) return { desc: 'Sağanak Yağış', icon: '🌧️' };
    if (code >= 95 && code <= 99) return { desc: 'Fırtınalı', icon: '⛈️' };
    return { desc: 'Bilinmiyor', icon: '❓' };
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // 1. Fetch Weather
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherJson = await weatherRes.json();
            const current = weatherJson.current_weather;

            // 2. Fetch City Name (Reverse Geocoding)
            // Using a free reliable API or fallback
            let city = "Konum Bulunamadı";
            try {
                const geoRes = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=tr`
                );
                const geoJson = await geoRes.json();
                city = geoJson.city || geoJson.locality || geoJson.principalSubdivision || "Bilinmeyen Konum";
            } catch (err) {
                console.error("Geocoding error", err);
                city = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
            }

            const info = getWeatherInfo(current.weathercode);

            setWeatherData({
              temp: Math.round(current.temperature),
              city: city,
              description: info.desc,
              icon: info.icon
            });
          } catch (err) {
            console.error(err);
            setError("Hava durumu alınamadı");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error(err);
          setError("Konum izni verilmedi");
          setLoading(false);
          // Fallback to Istanbul/Default if permission denied
           setWeatherData({
              temp: 15,
              city: "İstanbul (Varsayılan)",
              description: "Parçalı Bulutlu",
              icon: "⛅"
            });
        }
      );
    } else {
      setError("Tarayıcı konumu desteklemiyor");
      setLoading(false);
    }
  }, []);

  // Time update effect
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
      setDateTime(`${now.toLocaleDateString(undefined, optionsDate)}, ${now.toLocaleTimeString([], optionsTime)}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Tooltip effect
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsTooltipVisible(true);
      const timer2 = setTimeout(() => {
        setIsTooltipVisible(false);
      }, 3500);
      return () => clearTimeout(timer2);
    }, 1500);
    return () => clearTimeout(timer1);
  }, []);

  // Three.js effect
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Scene setup
    const scene = new THREE.Scene();
    const cameraAspect = (containerRect.width > 0 && containerRect.height > 0) ? containerRect.width / containerRect.height : 1;
    const camera = new THREE.PerspectiveCamera(60, cameraAspect, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(containerRect.width, containerRect.height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    camera.position.set(0, 0.5, 4.5);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(2, 3, 2);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xaabbee, 0.8, 15);
    pointLight.position.set(-1, 1, 3);
    scene.add(pointLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.8;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.target.set(0, 0, 0);

    // Clouds
    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);

    const cloudMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf0f8ff,
        transparent: true, opacity: 0.85, roughness: 0.6, metalness: 0.0,
        transmission: 0.1,
        ior: 1.3,
        specularIntensity: 0.2,
        sheen: 0.2, sheenColor: 0xffffff, sheenRoughness: 0.5,
        clearcoat: 0.05, clearcoatRoughness: 0.3,
    });

    function createCloudPart(radius: number, position: THREE.Vector3) {
        const geometry = new THREE.SphereGeometry(radius, 20, 20);
        const mesh = new THREE.Mesh(geometry, cloudMaterial);
        mesh.position.copy(position);
        return mesh;
    }

    function createDetailedCloud(x: number, y: number, z: number, scale: number) {
        const singleCloudGroup = new THREE.Group();
        singleCloudGroup.position.set(x, y, z);
        singleCloudGroup.scale.set(scale, scale, scale);
        const parts = [
            { radius: 0.8, position: new THREE.Vector3(0, 0, 0) }, { radius: 0.6, position: new THREE.Vector3(0.7, 0.2, 0.1) },
            { radius: 0.55, position: new THREE.Vector3(-0.6, 0.1, -0.2) }, { radius: 0.7, position: new THREE.Vector3(0.1, 0.4, -0.3) },
            { radius: 0.5, position: new THREE.Vector3(0.3, -0.3, 0.2) }, { radius: 0.6, position: new THREE.Vector3(-0.4, -0.2, 0.3) },
            { radius: 0.45, position: new THREE.Vector3(0.8, -0.1, -0.2) }, { radius: 0.5, position: new THREE.Vector3(-0.7, 0.3, 0.3) },
        ];
        parts.forEach(part => singleCloudGroup.add(createCloudPart(part.radius, part.position)));
        singleCloudGroup.userData = {
            isRaining: false, rainColor: Math.random() > 0.5 ? 0x87CEFA : 0xB0E0E6,
            originalPosition: singleCloudGroup.position.clone(), bobOffset: Math.random() * Math.PI * 2,
            bobSpeed: 0.0005 + Math.random() * 0.0003, bobAmount: 0.15 + Math.random() * 0.1,
        };
        return singleCloudGroup;
    }

    const cloud1 = createDetailedCloud(-0.7, 0.2, 0, 1.0);
    const cloud2 = createDetailedCloud(0.7, -0.1, 0.3, 0.9);
    cloudGroup.add(cloud1, cloud2);
    cloudGroup.position.y = -0.2;
    let autoRotateSpeed = 0.002;

    // Rain
    function createRaindropsForCloud(cloud: THREE.Group) {
        const rainGroup = new THREE.Group();
        cloud.add(rainGroup);
        cloud.userData.rainGroup = rainGroup;
        const raindropMaterial = new THREE.MeshBasicMaterial({ color: cloud.userData.rainColor, transparent: true, opacity: 0.7 });
        const localRaindrops: THREE.Mesh[] = [];
        for (let i = 0; i < 30; i++) {
            const raindropGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6);
            const raindrop = new THREE.Mesh(raindropGeom, raindropMaterial);
            raindrop.position.set( (Math.random() - 0.5) * 1.8, -0.8 - Math.random() * 1.5, (Math.random() - 0.5) * 1.8 );
            raindrop.userData = { originalY: raindrop.position.y - Math.random() * 0.5, speed: 0.08 + Math.random() * 0.05 };
            localRaindrops.push(raindrop);
            rainGroup.add(raindrop);
        }
        rainGroup.visible = false;
        return localRaindrops;
    }

    const raindrops1 = createRaindropsForCloud(cloud1);
    const raindrops2 = createRaindropsForCloud(cloud2);

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cloudGroup.children, true);

        if (intersects.length > 0) {
            let clickedObj = intersects[0].object;
            let physicallyClickedCloud: THREE.Object3D | null = null;
            while (clickedObj.parent && clickedObj.parent !== cloudGroup) {
                clickedObj = clickedObj.parent;
            }

            if (clickedObj.parent === cloudGroup) {
                physicallyClickedCloud = clickedObj;

                const isCloud1Raining = cloud1.userData.isRaining;
                const isCloud2Raining = cloud2.userData.isRaining;

                let newGlobalRainState;
                if (isCloud1Raining && isCloud2Raining) {
                    newGlobalRainState = false;
                } else {
                    newGlobalRainState = true;
                }

                cloud1.userData.isRaining = newGlobalRainState;
                if (cloud1.userData.rainGroup) {
                    cloud1.userData.rainGroup.visible = newGlobalRainState;
                }

                cloud2.userData.isRaining = newGlobalRainState;
                if (cloud2.userData.rainGroup) {
                    cloud2.userData.rainGroup.visible = newGlobalRainState;
                }

                if (physicallyClickedCloud) {
                    const originalScale = physicallyClickedCloud.scale.clone();
                    physicallyClickedCloud.scale.multiplyScalar(1.15);
                    setTimeout(() => {
                    if (physicallyClickedCloud) {
                        physicallyClickedCloud.scale.copy(originalScale);
                    }
                    }, 150);
                }
            }
        }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation Loop
    let animationId: number;
    function animate() {
        animationId = requestAnimationFrame(animate);
        const time = Date.now();
        cloudGroup.rotation.y += autoRotateSpeed;

        [cloud1, cloud2].forEach(cloud => {
            if (cloud) {
                cloud.position.y = cloud.userData.originalPosition.y + Math.sin(time * cloud.userData.bobSpeed + cloud.userData.bobOffset) * cloud.userData.bobAmount;

                if (cloud.userData.isRaining && cloud.userData.rainGroup) {
                    const currentRaindrops = cloud === cloud1 ? raindrops1 : raindrops2;
                    currentRaindrops.forEach(raindrop => {
                        raindrop.position.y -= raindrop.userData.speed;
                        if (raindrop.position.y < -5) {
                            raindrop.position.y = -0.8;
                            raindrop.position.x = (Math.random() - 0.5) * 1.8 * cloud.scale.x;
                            raindrop.position.z = (Math.random() - 0.5) * 1.8 * cloud.scale.z;
                        }
                    });
                }
            }
        });
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Resize handling
    const handleResize = () => {
       // Since the container might change size, we might need to recreate the renderer or update it
       // For simplicity in this React component, we might rely on the initial size or specific resize logic
       // But to be robust, let's update if container size changes.
       if (containerRef.current) {
         const newRect = containerRef.current.getBoundingClientRect();
         if (newRect.width > 0 && newRect.height > 0) {
            camera.aspect = newRect.width / newRect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(newRect.width, newRect.height);
         }
       }
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('click', handleClick);
        
        // Dispose Three.js resources
        renderer.dispose();
        scene.clear();
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
    };
  }, []);

  return (
    <div className={`${styles.wrapper} w-full flex justify-center items-center`}>
      <div className={`${styles.weatherWidget} w-full`}>
        {/* 3D Cloud Container */}
        <div 
            ref={containerRef} 
            className={`absolute top-0 right-0 w-36 h-36 sm:w-40 sm:h-40 z-30 cursor-pointer rounded-tr-3xl overflow-hidden ${styles.cloudContainer}`}
        >
            <div 
                className={`tooltip absolute top-20 right-2 sm:top-24 sm:right-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs transition-opacity duration-300 pointer-events-none z-40 shadow-lg ${isTooltipVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                Click clouds for a surprise!
                <div className="absolute -top-1 right-3 w-3 h-3 bg-black/70 transform rotate-45"></div>
            </div>
        </div>

        <div className="relative z-20">
            {error && (
              <div className="absolute top-0 left-0 w-full bg-red-500/20 text-red-200 text-xs p-1 rounded mb-2">
                {error}
              </div>
            )}
            {/* Date Time */}
            <div className={`text-sm font-light opacity-80 mb-1 tracking-wide ${styles.animateFadeInUp}`}>
                {dateTime}
            </div>

            {/* Current Weather */}
            <div className="flex items-center mb-2">
                <div className={`${styles.weatherIconMain} text-5xl mr-3`}>
                    {loading ? <span className="animate-pulse">...</span> : (weatherData?.icon || '⛅')}
                </div>
                <div className="text-5xl font-semibold">
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 ${styles.animateFadeInScaleUp} ${styles.delay100}`}>
                        {loading ? <span className="animate-pulse">--</span> : `${weatherData?.temp}°C`}
                    </span>
                </div>
            </div>

            {/* Location */}
            <div className={`text-lg opacity-90 mb-1 tracking-wide ${styles.animateFadeInUp} ${styles.delay200}`}>
                {loading ? 'Konum alınıyor...' : weatherData?.city}
            </div>
            
            {/* Description */}
            <div className={`text-sm opacity-70 mb-4 tracking-wide ${styles.animateFadeInUp} ${styles.delay200}`}>
                {loading ? '' : weatherData?.description}
            </div>

            {/* Sun Info */}
            <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 flex justify-between items-center mb-4 border border-white/10 shadow-md ${styles.animateFadeInUp} ${styles.delay300} ${styles.sunInfo}`}>
                <div className="text-center sunrise">
                    <div className={`text-xl mb-1 ${styles.sunIcon}`}>☀️</div>
                    <div className="text-xs opacity-80">6:14 am</div>
                </div>
                <div className="text-center text-sm opacity-90">11 h 42 m</div>
                <div className="text-center sunset">
                    <div className={`text-xl mb-1 ${styles.sunIcon}`}>🌙</div>
                    <div className="text-xs opacity-80">5:56 pm</div>
                </div>
            </div>

            {/* Precipitation */}
            <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center mb-4 border border-white/5 shadow-sm ${styles.animateFadeInUp} ${styles.delay400}`}>
                <div className={`text-2xl mr-2 text-blue-300 drop-shadow-lg ${styles.animateGentleBob}`}>🌧️</div>
                <div className="text-sm opacity-90">Rain 85%</div>
            </div>

            {/* Humidity & Wind */}
            <div className={`flex justify-between text-sm opacity-90 mb-5 ${styles.animateFadeInUp} ${styles.delay500}`}>
                <div>Humidity: 68%</div>
                <div>Wind: 12 km/h</div>
            </div>

            {/* Forecast */}
            <div className="flex flex-nowrap justify-between pb-2">
                <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-3 w-20 text-center border border-white/10 shadow-sm hover:bg-white/10 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${styles.animateFadeInUp} ${styles.delay500} ${styles.forecastDay}`}>
                    <div className="text-xs font-medium mb-1 opacity-80">Today</div>
                    <div className={`text-2xl my-1 drop-shadow-md ${styles.forecastIcon}`}>⛅</div>
                    <div className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">8°</div>
                    <div className="text-xs opacity-70">2°</div>
                </div>
                <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-3 w-20 text-center border border-white/10 shadow-sm hover:bg-white/10 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${styles.animateFadeInUp} ${styles.delay600} ${styles.forecastDay}`}>
                    <div className="text-xs font-medium mb-1 opacity-80">Fri</div>
                    <div className={`text-2xl my-1 drop-shadow-md ${styles.forecastIcon}`}>🌧️</div>
                    <div className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">7°</div>
                    <div className="text-xs opacity-70">1°</div>
                </div>
                <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-3 w-20 text-center border border-white/10 shadow-sm hover:bg-white/10 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${styles.animateFadeInUp} ${styles.delay700} ${styles.forecastDay}`}>
                    <div className="text-xs font-medium mb-1 opacity-80">Sat</div>
                    <div className={`text-2xl my-1 drop-shadow-md ${styles.forecastIcon}`}>🌧️</div>
                    <div className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">6°</div>
                    <div className="text-xs opacity-70">0°</div>
                </div>
                <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-3 w-20 text-center border border-white/10 shadow-sm hover:bg-white/10 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${styles.animateFadeInUp} delay-[0.8s] ${styles.forecastDay}`}>
                    <div className="text-xs font-medium mb-1 opacity-80">Sun</div>
                    <div className={`text-2xl my-1 drop-shadow-md ${styles.forecastIcon}`}>☀️</div>
                    <div className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">9°</div>
                    <div className="text-xs opacity-70">2°</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
