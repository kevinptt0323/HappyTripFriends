import React, {Component, PropTypes} from 'react';
import { withGoogleMap, GoogleMap, Marker, Polyline, DirectionsRenderer, Circle } from "react-google-maps";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Schedule from './Schedule';

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
    {   props.routes.map(route => (
            <DirectionsRenderer directions={route.directions} />
        ))
    }
    {
        props.start ? 
        <Circle 
            {...props.circle}
            zIndex={-1}
            onClick={props.onCircleClick}
        /> : null
    }
  </GoogleMap>
));

export default class TripGoogleMap extends Component{
    constructor(props){
        super(props);

        this.state = {
            start: false,
            markers: [],
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
            <div>
                <_TripGoogleMap
                    containerElement={
                        <div style={{ height: `100%` }}/>
                    }
                    mapElement={
                        <div style={{ height: `100%` }}/>
                    }
                    start={this.state.start}
                    markers={this.state.markers}
                    polylines={this.state.polylines}
                    directions={this.state.defDirections}
                    circle={this.state.circle}
                    routes={this.state.routes}
                    onMapClick={this.onMapClick.bind(this)}
                    onCircleClick={this.onMapClick.bind(this)}
                    onMarkerClick={this.onMarkerClick.bind(this)}
                />
                <MuiThemeProvider>
                    <Schedule 
                        spots={this.state.markers}
                        onUpdate={this.sliderUpdate.bind(this)}
                        onDragStop={this.sliderDragStop.bind(this)}
                    />
                </MuiThemeProvider>
            </div>
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
        if(!this.state.start)
            this.setState({start: true});
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
        
        console.log('getting markers');   
        let result = await this.getSpot(position);
        console.log('after getspot', result);    
        
        let markers = [];
        for(let r of result){
            markers.push({
                position: {
                    lat: r.spot.lat,
                    lng: r.spot.lng
                },
                key: r.spot.id,
                name: r.spot.name
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

    sliderUpdate(val){
        this.setState({
            circle: {
                center: this.state.circle.center,
                radius: val * 100
            }
        });
    }

    async sliderDragStop(val){
        let position = {
            center: this.state.circle.center,
            radius: val * 100
        };
        console.log('getting markers');   
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

}
