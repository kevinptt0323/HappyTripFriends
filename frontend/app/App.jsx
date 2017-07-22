import React, {Component, PropTypes} from 'react';
import { Route, Link } from 'react-router-dom';
import TripGoogleMap from './components/Maps';

export default class App extends Component{
    constructor(props){
        super(props);
        this.style = {
            height: '50%',
            width: '100%'
        };

        this.state = {
            radius: 25 * 100
        };
        
        this.circle = {
            center: {lat: 25.0112183, lng: 121.52067570000001}
 
        }

    }


    onCircleClick(e){
        console.log('circle clicked: ',e);
        
        this.circle.center = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        } 
    }

    onMapClick(e){
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
        
        this.circle.center = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        } 
    }

    render(){
        return (
            <div>
                <div style={this.style}>
                    <Route path="/map" component={ props => 
                        <TripGoogleMap {...props} 
                            radius={this.state.radius}
                            center={this.circle.center}
                            onMapClick={this.onMapClick.bind(this)}
                            onCircleClick={this.onCircleClick.bind(this)}
                        />}
                    />
                </div>
            </div>
        );
    }
}
