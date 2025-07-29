import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

const Mapbox = ({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      center: [lng, lat], // starting position [lng, lat]
      zoom: zoom || 14, // starting zoom
      touchZoomRotate: false,
      scrollZoom: {
        around: 'center',
      },
      dragPan: false,
    })
    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current)
  }, [])

  return <div style={{ height: '100%', width: '100%' }} ref={mapContainerRef} className='map-container' />
}

export default Mapbox
