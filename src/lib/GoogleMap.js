import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import { useMutationObserver } from 'rooks';
import { Button, Typography } from 'antd';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from 'react-icons/ai';
import Gmap from 'google-map-react';
import './GoogleMap.css';

const GMAPKEY = process.env.REACT_APP_GMAPS_KEY;
const GMAPCENTER = process.env.REACT_APP_GMAPS_CENTER
  ? process.env.REACT_APP_GMAPS_CENTER.split(',').map(l => parseFloat(l))
  : [14.5779, 121.1360];

const defaults = {
  center: GMAPCENTER,
  zoom: 9,
  lng: 0,
  lat: 0
};

const Pin = props => {
  if (!props.lat || !props.lng) {
    return null;
  }

  return (
    <Typography.Text className='shookt-pinbox' type='danger'>
      <FaMapMarkerAlt className='shookt-mappin' />
    </Typography.Text>
  );
};

const GoogleMap = ({
  theme = [],
  style = {},
  form,
  key = GMAPKEY,
  values = defaults,
  onChange = Function.prototype,
  readOnly = false,
  reCenter = false,
  latField = '',
  lngField = '',
  children
}) => {
  values = { ...defaults, ...values };
  values.zoom = values.zoom || 9;
  if (!values.center || !values.center[0] || !values.center[1]) {
    values.center = GMAPCENTER;
  }

  const [latlng, setLatlng] = useState([]);
  const [map, setMap] = useState(null);
  const box = useRef(0);
  const FullScreen = () => {
    const [full, setFull] = useState(false);
    const btn = useRef(0);
    const onClick = (e, close) => {
      if (full || close) {
        if (box.current && box.current.style) {
          box.current.style.position = null;
          box.current.style.width = null;
          box.current.style.height = null;
          box.current.style.top = null;
          box.current.style.left = null;
          box.current.style.zIndex = null;
        }
        setFull(false);
      } else {
        if (box.current && box.current.style) {
          box.current.style.position = 'fixed';
          box.current.style.width = '100%';
          box.current.style.height = '100%';
          box.current.style.top = 0;
          box.current.style.left = 0;
          box.current.style.zIndex = 100;
        }
        setFull(true);
      }
      btn.current.blur();
    };
    const onKeyDown = e => {
      switch (e.keyCode) {
        case 27:
          onClick(null, true);
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }, []);

    return (
      <Button
        ref={btn}
        onClick={onClick}
        style={{
          marginTop: 5,
          marginLeft: 5,
          lineHeight: '35px'
        }}
        icon={
          <span style={{ fontSize: 26 }}>
            {full ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
          </span>
        }
      />
    );
  };

  const onLoad = ({ map }) => {
    const controlButtonDiv = document.createElement('div');
    createRoot(controlButtonDiv).render(<FullScreen />);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlButtonDiv);
    setMap(map);
  };

  useMutationObserver(box, () => {
    if (map && reCenter && box.current.style && box.current.style.position !== 'fixed') {
      if (latlng.length) {
        map.setCenter({ lat: latlng[0], lng: latlng[1] });
      } else if (values.lat && values.lng) {
        map.setCenter({ lat: values.lat, lng: values.lng });
      }
    }
  }, {
    attributes: true,
    subtree: false,
    childList: false,
    characterData: false
  });

  return (
    <div ref={box} className='shookt-gmaps' style={style}>
      <Gmap
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={onLoad}
        bootstrapURLKeys={{ key }}
        zoom={values.zoom}
        center={values.center}
        options={() => ({
          styles: theme,
          controlSize: 24,
          fullscreenControl: false
        })}
        onClick={e => {
          if (readOnly) {
            return;
          }

          onChange({
            ...values,
            lat: e.lat,
            lng: e.lng
          });
          setTimeout(() => {
            onChange({
              ...values,
              lat: e.lat,
              lng: e.lng,
              center: [
                parseFloat(e.lat),
                parseFloat(e.lng)
              ]
            });
          }, 100);

          setLatlng([e.lat, e.lng]);

          if (form) {
            if (latField) {
              form.setFieldsValue({ [latField]: e.lat });
            }
            if (lngField) {
              form.setFieldsValue({ [lngField]: e.lng });
            }
          }
        }}
      >
        <Pin lat={values.lat} lng={values.lng} />
        {children}
      </Gmap>
    </div>
  );
};

export default GoogleMap;
