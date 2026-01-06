import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore } from '../lib/store';
import { useTheme } from 'next-themes';

export default function MapPanel() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { tasks, setCurrentLocation } = useAppStore();
  const { theme } = useTheme();
  const markers = useRef<maplibregl.Marker[]>([]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation(latitude, longitude);
        map.current?.flyTo({ center: [longitude, latitude], zoom: 15 });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // Optionally toast error here
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const defaultLat = 35.6812;
    const defaultLng = 139.7671;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            }
          ]
        },
        center: [defaultLng, defaultLat],
        zoom: 14,
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      const resizeObserver = new ResizeObserver(() => {
        if (map.current) map.current.resize();
      });
      resizeObserver.observe(mapContainer.current);



      return () => {
        resizeObserver.disconnect();
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, [setCurrentLocation]); // Removed theme from dependency as we handle it via CSS

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(m => m.remove());
    markers.current = [];

    tasks.forEach(task => {
      const el = document.createElement('div');
      el.className = 'universal-marker';
      el.style.width = '48px';
      el.style.height = '48px';
      el.style.backgroundColor = '#16a34a';
      el.style.borderRadius = '50%';
      el.style.border = '4px solid white';
      el.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '24px';
      el.innerHTML = '🙋‍♂️';

      const marker = new maplibregl.Marker(el)
        .setLngLat([task.location.lng, task.location.lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 20px; font-family: sans-serif; min-width: 200px; background: ${theme === 'dark' ? '#000' : '#fff'}; color: ${theme === 'dark' ? '#fff' : '#000'};">
            <h3 style="font-weight: 900; margin-bottom: 8px; font-size: 18px;">${task.title}</h3>
            <div style="background: #f0fdf4; padding: 10px; border-radius: 12px; margin-bottom: 12px; text-align: center;">
              <span style="font-size: 20px; color: #16a34a; font-weight: 900;">${task.reward} JPYC</span>
            </div>
            <button style="background: #16a34a; color: white; border: none; padding: 12px; border-radius: 15px; font-weight: 900; font-size: 14px; cursor: pointer; width: 100%;">助ける</button>
          </div>
        `))
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [tasks, theme]);

  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-950">
      <div
        ref={mapContainer}
        className={`absolute inset-0 w-full h-full ${theme === 'dark' ? 'dark-map' : ''}`}
      />
      <style jsx global>{`
        .maplibregl-ctrl-attrib { display: none; }
        .maplibregl-popup-content { border-radius: 24px; padding: 0; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .maplibregl-popup-close-button { padding: 10px; font-size: 20px; }
        
        .dark-map .maplibregl-canvas {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important;
        }
      `}</style>
      <button
        onClick={handleGetCurrentLocation}
        className="absolute bottom-24 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg z-10 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="現在地へ移動"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-white">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      </button>
    </div>
  );
}
