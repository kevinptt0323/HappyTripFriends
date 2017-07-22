import React, {Component, PropTypes} from 'react';
import { Route, Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TripGoogleMap from './components/Maps';
import Schedule from './components/Schedule';

export default class App extends Component{
    constructor(props){
        super(props);
        this.style = {
            height: '50%',
            width: '100%'
        };

        this.state = {
            circle: 50
        };
    }

    sliderUpdate(val){
        this.setState({circle: val});
    }

    render(){
        return (
            <div>
                <div style={this.style}>
                    <Route path="/map" component={props => 
                        <TripGoogleMap {...props} circle={this.state.circle}/>} 
                    />
                </div>
                <MuiThemeProvider>
                    <Schedule onUpdate={this.sliderUpdate.bind(this)}/>
                </MuiThemeProvider>
            </div>
        );
    }
}
