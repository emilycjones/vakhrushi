import React from 'react';
import mapbox from 'mapbox-gl';

import Location from './Location.js'

const PUBLIC_ACCESS_TOKEN = 'pk.eyJ1IjoiZW1pbHljam9uZXMiLCJhIjoiY2syenpyYWNlMGJmZjNkbHJ3ZWNwczc5eiJ9.xHZqKSrNi5xS7tUht5kyjA';

class Map extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      map: [],
      locations: [],
      location: {},
      prevLocation: "",
      images: [],
      id: -1,
      features: []
    };
  }

  loadLocations() {
      fetch(
          `/locations`,
          {
              credentials: 'same-origin',
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              },
          }
      ).then((response) => response.json())
      .then((data) => {
          const { locations } = data;
          this.setState({locations: locations});
          this.makeFeatures();
      })
  }

  getLocation(clickedLat, clickedLong) {
    var total = 200;
    var l = "";
    for (var i = 0; i < this.state.locations.length; i++) {
        var location = this.state.locations[i];
        var lat = location.lat;
        var long = location.long;
        var dLat = Math.abs(lat - clickedLat);
        var dLong = Math.abs(long - clickedLong)
        var t = dLat + dLong;
        if (t < total) {
          total = t;
          l = location;
        }
    }
    this.getImages(l.id);
    this.setState({
      location: l,
      id: l.id
    })
    return l;
  }

  makeFeatures() {
    var features = []
    this.state.locations.map( location => (
      features.push(this.makeFeature(location))
    ))
    this.setState({
      features: features
    })
    this.state.map.addLayer({

    })
  }

  makeFeature(location) {
    var name = location.building_type || location.address
    var geojson =
    { "type": "Feature",
      "geometry":
      { "type": "Point",
        "coordinates": [location.lat, location.long]
      },
      "properties": {  "title": location.name}
    }
    return geojson;
  }


  getImages(locationId) {
    fetch(
        `/images/${locationId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
    .then((response) => response.json())
    .then((data) => {
        const { images } = data;
        this.setState({
          images: images
        });
    })
  }

  loadPage(page) {
    this.props.history.push(`/text/${page}`);
  }

  componentDidMount() {
    mapbox.accessToken = PUBLIC_ACCESS_TOKEN;

    var map = new mapbox.Map({
        container: 'map',
        style: 'mapbox://styles/emilycjones/ck3y61c9z7hq41cpde6eeldnp',
        center: [ 50.031508, 58.681738],
        zoom: 2,
        minZoom: 1.5
    });
    this.loadLocations(map);
    this.setState({
      map: map
    })

    map.on('load', () => {
      this.addVakhrushi(map);
      map.flyTo({
        center: [50.031508, 58.681738],
        zoom: 15,
        speed: 0.3
      });
     })


     map.on('click', 'Vakhrushi', (e) => {
       // console.log(e.lngLat.lat)
       var location = this.getLocation(e.lngLat.lng, e.lngLat.lat);
       this.setState({
         location: location
       })
       var id = location.id.toString() + "str";
       var name = location.building_type || location.address;
       console.log(this.state.features)
       this.state.map.addLayer({
          "id": id,
          "type": "symbol",
          "source": {
          "type": "geojson",
          "data":
          { "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [this.state.location.lat, this.state.location.long]
            },
            "properties": {
              "title": name
            }
            }]
          }
        },
        "layout": {
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#ffbb9c"
        }
      });
    });
  }
  //#ffae00

  addVakhrushi(map) {
    map.addLayer({
         'id' : "Vakhrushi",
         'type' : "fill",
         'source': {
           'type': 'geojson',
           'data': {
             'type': "Feature",
             'geometry': {
               'type': "Polygon",
               'coordinates': [[
                 [50.029130, 58.695973],
                 [50.045285, 58.692703],
                 [50.053711, 58.682044],
                 [50.048760, 58.677424],
                 [50.008429, 58.671803],
                 [49.996772, 58.676294],
                 [50.008300, 58.687309],
                 [50.008766, 58.689003],
                 [50.014122, 58.692997],
               ]]
             }
           }
         },
         'layout': {},
         'paint': {
           'fill-color': '#9cfff3',
           'fill-opacity': 0.1
         }
     })
  }



  render() {
    return (
      <div id="map-container">
        <div id="map" style={{height: "100%", minHeight: "610px"}}></div>
        <Location location={this.state.location} images={this.state.images} loadPage={this.loadPage.bind(this)}/>
      </div>
    );
  }

}

export default Map;
