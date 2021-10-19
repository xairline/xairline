import 'mapbox-gl/dist/mapbox-gl.css';
import { useObserver } from 'mobx-react-lite';
import { GeoJSONLayer, Marker } from 'react-mapbox-gl';
import { useStores } from '../../store';
import { Livemap as MyLivemap } from '@xairline/shared-rest-client-remote';
import { Avatar, Row } from 'antd';

/* eslint-disable-next-line */
export interface LivemapProps {
  mapControl: any;
}
export function Livemap(props: LivemapProps) {
  const { LivemapStore } = useStores();

  const layoutLayer = {
    'icon-image': 'xairline',
    'icon-size': 0.05,
    'icon-ignore-placement': true,
    'icon-allow-overlap': true,
    'text-field': '{flight_number}  {route}',
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, 1.5],
    'text-anchor': 'top',
    'text-size': 12,
  };

  return useObserver(() => {
    let features = LivemapStore.planes?.map((plane: MyLivemap) => {
      return {
        type: 'Feature',
        properties: {
          id: plane.airline,
          flight_number: plane.flight_number,
          route: plane.route,
          flighData: JSON.parse(plane.flight_data as string),
        },
        geometry: {
          type: 'Point',
          coordinates: [plane.longitude, plane.latitude],
        },
      };
    });
    if (!features) {
      features = [];
    }
    const geojson: any = {
      type: 'FeatureCollection',
      features,
    };
    return (
      <>
        <GeoJSONLayer
          data={geojson}
          // symbolLayout={layoutLayer}
          // symbolPaint={{ 'text-color': '#6d9eeb' }}
          // symbolOnClick={(event: any) => {
          //   //TODO event?.features[0].properties
          // }}https://xairline.org/images/logo.png
        />
        {geojson.features.map((feature: any) => {
          return (
            <Marker
              coordinates={feature.geometry.coordinates}
              onClick={() => {
                props.mapControl({
                  coordinates: feature.geometry.coordinates,
                  zoom: 10,
                });
              }}
            >
              <div>
                <Row align="middle">
                  <Avatar
                    src={LivemapStore.getAirlineProfilePic(
                      feature.properties.id
                    )}
                    style={{
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  />
                </Row>
                <Row align="middle">
                  <span style={{ color: '#6d9eeb' }}>
                    {feature.properties.flight_number} -{' '}
                    {feature.properties.route}
                  </span>
                </Row>
              </div>
            </Marker>
          );
        })}
        ;
      </>
    );
  });
}
export default Livemap;
