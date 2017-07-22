import React, {Component, PropTypes} from 'react';
import { withGoogleMap, GoogleMap, Marker, Polyline, DirectionsRenderer, Circle } from "react-google-maps";

const _TripGoogleMap = withGoogleMap( props => (
    <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={13}
        defaultCenter={{
            lat: 25.0112183,
            lng: 121.52067570000001,
        }}
        onClick={props.onMapClick}
    >
    {
        props.markers.map((marker, index) => (
            <Marker
                {...marker}
                //onRightClick={() => props.onMarkerRightClick(index)}
            />
        ))
    }
    {
        props.polylines.map((polyline, index) => (
            <Polyline 
                {...polyline}
            />
        ))
    }
    {props.directions && <DirectionsRenderer directions={props.directions} />}
    <Circle {...props.circle} />
  </GoogleMap>
));

export default class TripGoogleMap extends Component{
    constructor(props){
        super(props);

        this.state = {
            markers: [{
                position: {
                    lat: 25.0112183,
                    lng: 121.52067570000001,
                },
                key: `Taiwan`
            },
            {
                position: {
                    lat: 25.0112183,
                    lng: 120.52067570000001,
                },
                key: `test`
            }],
            polylines: [{
                path: [
                    {lat: 25.0112183, lng: 121.52067570000001},
                    {lat: 25.0112183, lng: 121.53067570000001}
                ],
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                key: `poly`
            }],
            circle: {
                center: {
                    lat: 25.0112183,
                    lng: 121.53067570000001 
                },
                radius: this.props.circle * 70
            },
            origin: new google.maps.LatLng(25.0112183, 121.52067570000001),
            destination: new google.maps.LatLng(25.0112183, 121.60067570000001),
            directions: null
        }
    }

    componentDidMount(){
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
            origin: this.state.origin,
            destination: this.state.destination,
            travelMode: google.maps.TravelMode.TRANSIT,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                console.log(result);
                this.setState({
                    directions: result,
                });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }

    render(){
        return (
            <_TripGoogleMap
                containerElement={
                    <div style={{ height: `100%` }}/>
                }
                mapElement={
                    <div style={{ height: `100%` }}/>
                }
                markers={this.state.markers}
                polylines={this.state.polylines}
                directions={this.state.directions}
                circle={this.state.circle}
            />
        );
    }
}
