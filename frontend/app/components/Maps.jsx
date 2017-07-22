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
                onClick={()=>props.onMarkerClick(index)}
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
    {   props.directions?<DirectionsRenderer directions={props.directions} />:null}
    {   props.routes.map(route => (
            <DirectionsRenderer directions={route.directions} />
        ))
    }
    <Circle 
        {...props.circle}
        zIndex={-1}
        onClick={props.onCircleClick}
    />
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
                center: this.props.center,
                radius: this.props.radius
            },
            defOrigin: new google.maps.LatLng(25.0112183, 121.52067570000001),
            defDestination: new google.maps.LatLng(25.0112183, 121.60067570000001),
            defDirections: null,
            routes: [
            ]
        };

        this.directionIndex = 0;
    }

    componentDidMount(){
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
            origin: this.state.defOrigin,
            destination: this.state.defDestination,
            travelMode: google.maps.TravelMode.TRANSIT,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({defDirections: result});
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
                directions={this.state.defDirections}
                circle={this.state.circle}
                routes={this.state.routes}
                onMapClick={this.onMapClick.bind(this)}
                onCircleClick={this.onMapClick.bind(this)}
                onMarkerClick={this.onMarkerClick.bind(this)}
            />
        );
    }
    
    getSpot(position){
        return new Promise( resolve => {
            $.getJSON('http://trip.kevinptt.com.tw/api/nearby', position, (r) => {
                let len = r.length;
                if(len > 20)
                    [...Array(20).keys()].map( (key) => {
                        console.log('async ya');
                        let ran = Math.floor(Math.random() * r.length);
                        [r[key], r[ran]] = [r[ran], r[key]];
                        if(parseInt(key) == 19)
                            resolve(r.splice(0, 20));
                    });
                else 
                    resolve(r);
            });
        });
    }

    async onMapClick(e){
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
        
        let position = {
            center: {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            },
            radius: this.state.circle.radius
        };

        this.setState({circle: position});
        this.props.onMapClick(e);
        
        let result = await this.getSpot(position);
        console.log('after getspot', result);    
        
        let markers = [];
        for(let r of result){
            markers.push({
                position: {
                    lat: r.spot.lat,
                    lng: r.spot.lng
                },
                key: r.spot.name
            });
        }

        this.setState({markers});
    }

    onMarkerClick(index){
        console.log(index);
        let {routes, markers, circle} = this.state;
        let len = routes.length;

        const DirectionsService = new google.maps.DirectionsService();
        
        let origin = (len == 0) ? 
            new google.maps.LatLng(circle.center.lat, circle.center.lng): 
            routes[len-1].destination;

        let destination = new google.maps.LatLng(markers[index].position.lat, markers[index].position.lng);

        DirectionsService.route({
            origin, destination,
            travelMode: google.maps.TravelMode.TRANSIT,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                routes.push({
                    origin, destination, directions: result
                })
                this.setState({routes});
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }

}
