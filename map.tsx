'use client'

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'

import L from 'leaflet'

import { useEffect, useState } from 'react'

import { io } from 'socket.io-client'

import { useLiveGuards } from '@/hooks/admin/use-live-guards'

import {
  Polyline,
  CircleMarker,
} from 'react-leaflet'

import {
  Shield,
  Battery,
  Navigation,
} from 'lucide-react'
import { usePatrolCheckpoints } from '@/hooks/admin/use-patrol-checkpoints'
import MarkerClusterGroup from 'react-leaflet-cluster'

const COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'black',
]

// function createIcon(
//   color: string,
//   name: string,
// ) {
//   return new L.DivIcon({
//     html: `
//       <div style="display:flex;flex-direction:column;align-items:center;">

//         <div
//           style="
//             background:${color};
//             width:22px;
//             height:22px;
//             border-radius:50%;
//             border:4px solid white;
//             box-shadow:0 4px 10px rgba(0,0,0,0.35);
//           "
//         ></div>

//         <div
//           style="
//             margin-top:4px;
//             background:white;
//             padding:2px 8px;
//             border-radius:999px;
//             font-size:10px;
//             font-weight:700;
//             box-shadow:0 2px 8px rgba(0,0,0,0.15);
//             white-space:nowrap;
//           "
//         >
//           ${name}
//         </div>
//       </div>
//     `,
//     className: '',
//     iconSize: [40, 40],
//   })
// }

function createIcon(
  color: string,
  guardName: string,
  heading?: number,
) {
  return new L.DivIcon({
    html: `
      <div style="display:flex;align-items:center;gap:8px;">
        
        <div
          style="
            position:relative;
            width:20px;
            height:20px;
            border-radius:999px;
            background:${color};
            border:3px solid white;
            box-shadow:0 0 10px rgba(0,0,0,0.4);
          "
        >
          <div
            style="
              position:absolute;
              top:-12px;
              left:2px;
              transform:rotate(${heading || 0}deg);
              font-size:14px;
              color:${color};
              font-weight:bold;
            "
          >
            ▲
          </div>
        </div>

        <div
          style="
            background:white;
            padding:4px 8px;
            border-radius:999px;
            font-size:12px;
            font-weight:600;
            box-shadow:0 2px 8px rgba(0,0,0,0.15);
            white-space:nowrap;
          "
        >
          ${guardName}
        </div>

      </div>
    `,
    className: '',
    iconAnchor: [10, 10],
  })
}

function AutoFitBounds({
  guards,
}: any) {
  const map = useMap()

  useEffect(() => {
    if (!guards.length) return

    const bounds = L.latLngBounds(
      guards.map((g: any) => [
        Number(
          g.currentLocation.latitude,
        ),
        Number(
          g.currentLocation.longitude,
        ),
      ]),
    )

    map.fitBounds(bounds, {
      padding: [50, 50],
    })
  }, [guards, map])

  return null
}

function getNearestCheckpoint(
  currentLat: number,
  currentLng: number,
  checkpoints: any[],
) {
  if (!checkpoints.length) {
    return null
  }

  let nearest = checkpoints[0]
  let shortestDistance = Infinity

  checkpoints.forEach((checkpoint) => {
    const latDiff =
      currentLat -
      Number(checkpoint.latitude)

    const lngDiff =
      currentLng -
      Number(checkpoint.longitude)

    const distance =
      Math.sqrt(
        latDiff * latDiff +
        lngDiff * lngDiff,
      )

    if (distance < shortestDistance) {
      shortestDistance = distance
      nearest = checkpoint
    }
  })

  return nearest
}

function FlyToGuard({
  position,
}: {
  position: [number, number]
}) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, 17, {
      duration: 1.5,
    })
  }, [position, map])

  return null
}

function createNextCheckpointIcon() {
  return new L.DivIcon({
    html: `
      <div
        style="
          width:20px;
          height:20px;
          background:#f59e0b;
          border:3px solid white;
          border-radius:999px;
          box-shadow:0 0 10px rgba(0,0,0,0.4);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:10px;
          font-weight:bold;
        "
      >
        ▶
      </div>
    `,
    className: '',
  })
}

export function LiveGuardMap() {
  const {
    data: checkpointsData,
  } = usePatrolCheckpoints()

  const checkpoints = checkpointsData?.data || []
  const { data } = useLiveGuards()

  const [guards, setGuards] = useState<any[]>([])
  const [selectedGuard, setSelectedGuard] = useState<any>(null)

  useEffect(() => {
    if (data?.data) {
      setGuards(data.data)
    }
  }, [data])

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL!,
      {
        transports: ['websocket'],
      },
    )

    socket.on(
      'guard.location.updated',
      (payload) => {
        console.log('Socket payload:', payload)
        setGuards((prev) => {
          const existing =
            prev.find(
              (g) =>
                g.guardId ===
                payload.guardId,
            )

          if (existing) {
            return prev.map((g) =>
              g.guardId ===
                payload.guardId
                ? payload
                : g,
            )
          }

          return [
            ...prev,
            payload,
          ]
        })
      },
    )

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Guards
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {guards.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Patrol Checkpoints
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {checkpoints.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Tracking Status
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

            <span className="font-semibold text-green-600">
              LIVE
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Guards Moving
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {
              guards.filter(
                (g) =>
                  Number(
                    g.currentLocation?.speed,
                  ) > 0,
              ).length
            }
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
          {guards.map((guard, index) => {
            const color =
              COLORS[index % COLORS.length]

            const moving =
              (guard.currentLocation?.speed || 0) >
              0

            return (
              <button
                key={guard.guardId}
                onClick={() =>
                  setSelectedGuard(guard)
                }
                className="rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: color,
                      }}
                    />

                    <p className="font-semibold">
                      {guard.guardName}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${moving
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    {moving
                      ? 'MOVING'
                      : 'IDLE'}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Zone: {guard.zone}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Battery className="h-4 w-4" />

                  <span>
                    {
                      guard.currentLocation
                        ?.batteryLevel
                    }
                    %
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <MapContainer
          center={[6.5244, 3.3792]}
          zoom={14}
          style={{
            height: '80vh',
            width: '100%',
          }}
          className="z-0 rounded-3xl"
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AutoFitBounds guards={guards} />

          {selectedGuard && (
            <FlyToGuard
              position={[
                Number(
                  selectedGuard.currentLocation
                    ?.latitude,
                ),
                Number(
                  selectedGuard.currentLocation
                    ?.longitude,
                ),
              ]}
            />
          )}

          {checkpoints.map(
            (checkpoint: any) => {
              const latitude = Number(
                checkpoint.latitude,
              )

              const longitude = Number(
                checkpoint.longitude,
              )

              // Skip invalid checkpoints
              if (
                Number.isNaN(latitude) ||
                Number.isNaN(longitude) ||
                latitude === 0 ||
                longitude === 0
              ) {
                return null
              }

              return (
                <CircleMarker
                  key={checkpoint.id}
                  center={[
                    latitude,
                    longitude,
                  ]}
                  radius={10}
                  pathOptions={{
                    color: '#dc2626',
                  }}
                >
                  <Popup>
                    {(() => {
                      const nextCheckpoint =
                        getNearestCheckpoint(
                          latitude,
                          longitude,
                          checkpoints,
                        )

                      return nextCheckpoint ? (
                        <div className="rounded-xl bg-slate-100 p-2">
                          <p className="text-xs text-slate-500">
                            Predicted Destination
                          </p>

                          <p className="font-semibold">
                            {nextCheckpoint.name}
                          </p>
                        </div>
                      ) : null
                    })()}
                    <div>
                      <h3 className="font-bold">
                        {checkpoint.name}
                      </h3>

                      <p className="text-sm">
                        {checkpoint.zone}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            },
          )}
          <MarkerClusterGroup
            chunkedLoading
          >
            {guards.map(
              (guard, index) => {
                const latitude = Number(
                  guard?.currentLocation
                    ?.latitude,
                )

                const longitude = Number(
                  guard?.currentLocation
                    ?.longitude,
                )

                if (
                  Number.isNaN(latitude) ||
                  Number.isNaN(longitude)
                ) {
                  return null
                }

                const color =
                  COLORS[index % COLORS.length]

                return (
                  <div key={guard.guardId}>
                    <Marker
                      position={[
                        latitude,
                        longitude,
                      ]}
                      icon={createIcon(
                        color,
                        guard.guardName,
                        guard.currentLocation?.heading,
                      )}
                    >
                      <Popup>
                        <div className="min-w-[220px] space-y-3">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-red-600" />

                            <h3 className="font-bold">
                              {guard.guardName}
                            </h3>
                          </div>

                          <div className="space-y-1 text-sm">
                            <p>
                              Zone: {guard.zone}
                            </p>

                            <div className="flex items-center gap-2">
                              <Navigation className="h-4 w-4" />

                              <span>
                                Speed:{' '}
                                {guard.currentLocation
                                  .speed || 0}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Battery className="h-4 w-4" />

                              <span>
                                Battery:{' '}
                                {guard.currentLocation
                                  .batteryLevel || 0}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    {guard.nextCheckpoint && (
                      <>
                        <Marker
                          position={[
                            Number(
                              guard.nextCheckpoint.latitude,
                            ),
                            Number(
                              guard.nextCheckpoint.longitude,
                            ),
                          ]}
                          icon={createNextCheckpointIcon()}
                        >
                          <Popup>
                            <div>
                              <p className="text-xs text-slate-500">
                                Next Checkpoint
                              </p>

                              <h3 className="font-bold">
                                {guard.nextCheckpoint.name}
                              </h3>
                            </div>
                          </Popup>
                        </Marker>

                        <Polyline
                          positions={[
                            [latitude, longitude],
                            [
                              Number(
                                guard.nextCheckpoint.latitude,
                              ),
                              Number(
                                guard.nextCheckpoint.longitude,
                              ),
                            ],
                          ]}
                          pathOptions={{
                            color,
                            dashArray: '6',
                            weight: 3,
                            opacity: 0.8,
                          }}
                        />
                      </>
                    )}

                    {guard.trail?.length > 1 && (
                      <Polyline
                        positions={guard.trail.map(
                          (point: any) => [
                            Number(
                              point.latitude,
                            ),
                            Number(
                              point.longitude,
                            ),
                          ],
                        )}
                        pathOptions={{
                          color,
                          weight: 4,
                          opacity: 0.7,
                        }}
                      />
                    )}
                  </div>
                )
              },
            )}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {guards.map((guard, index) => {
          const color =
            COLORS[index % COLORS.length]

          return (
            <div
              key={guard.guardId}
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          color,
                      }}
                    />

                    <h3 className="font-bold">
                      {guard.guardName}
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {guard.zone}
                  </p>
                </div>

                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  LIVE
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Speed</span>

                  <span className="font-medium">
                    {
                      guard.currentLocation
                        ?.speed
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Battery</span>

                  <span className="font-medium">
                    {
                      guard.currentLocation
                        ?.batteryLevel
                    }
                    %
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div> */}
    </div>
  )
}
