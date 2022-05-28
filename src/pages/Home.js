import React, { useState, useRef, } from "react";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from 'react-mapbox-gl-geocoder'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css"

// Please be a decent human and don't abuse my Mapbox API token.
// If you fork this sandbox, replace my API token with your own.
// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN =
    "pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA";

const Home = ({ result, setResult }) => {
    const navigate = useNavigate();
    const [viewport, setViewport] = useState({
        latitude: 24.8607,
        longitude: 67.0011,
        zoom: 11.4
    });

    const [pickMarker, setPickMarker] = useState(false);
    const [ready, setReady] = useState(false);

    const final = () => {
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${viewport.longitude},${viewport.latitude}.json?access_token=pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA`).then(res => {
            const { data } = res;
            setResult({ latitude: viewport.latitude, longitude: viewport.longitude, location: data.features[0].place_name });
            setReady(true)
        })
    }

    const mapRef = useRef();
    const handleViewportChange = (newViewport, item) => {
        if (ready) {
            setResult({ ...result, location: '' });
            setReady(false)
        }
        console.log(item);
        setViewport(newViewport);
        item.isPanning != true && item.isZooming != true && setResult({ latitude: newViewport.latitude, longitude: newViewport.longitude, location: item.place_name })
    }

    // const onSelected = (viewPort, item) => {
    //   navigate("/map");
    //   console.log(viewPort);
    //   setViewport({ ...viewPort, zoom: viewPort.zoom * 20 });
    //   console.log('Selected: ', item)
    // }

    const onDragStart = React.useCallback(() => {
        console.log("run")
    }, []);

    console.log(viewport);
    console.log(result);

    return (
        <>
            <div>
                <div className="autocomplete-input">
                    <span className="iconify" data-icon="bx:current-location"></span>
                    <Geocoder
                        mapboxApiAccessToken={MAPBOX_TOKEN} onSelected={(newViewport, item) => {handleViewportChange(newViewport, item); setReady(true)}} viewport={viewport} hideOnSelect={true} initialInputValue={result.location}
                    />
                </div>
                <div className="select-location-btn">
                    <button onClick={() => { setPickMarker(true) }}>Select Location on Map</button>
                </div>
                {
                    (pickMarker || ready) && <div className="select-btn">
                        <button onClick={!ready ? () => final() : () => navigate("/result")} className={ready ? "ready" : "not-ready"}> {ready ? "Confirm Pickup" : "Select"} </button>
                    </div>
                }
            </div>
            <MapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="100%"
                onViewportChange={handleViewportChange}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                onTouchStart={onDragStart}
            >
                {pickMarker ?
                    <>
                        <Marker
                            longitude={viewport.longitude}
                            latitude={viewport.latitude}
                        >
                            <button className="marker-btn" style={{ background: 'none', border: 'none', cursor: "pointer" }}>
                                <img src="assets/map-pin-icon.png" alt="location marker" width="30" />
                            </button>
                        </Marker>
                        <Popup longitude={viewport.longitude}
                            latitude={viewport.latitude}
                            closeButton={false}>
                            <p>{result.location}</p>
                        </Popup>
                    </>
                    : <Marker
                        longitude={result.longitude}
                        latitude={result.latitude}
                    >
                        <button className="marker-btn" style={{ background: 'none', border: 'none', cursor: "pointer" }}>
                            <img src="assets/pngwing.png" alt="location marker" width="20" />
                        </button>
                    </Marker>}
            </MapGL>
        </>
    );
};

export default Home;
