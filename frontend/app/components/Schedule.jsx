import React, {Component, PropTypes} from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import Slider from 'material-ui/Slider';

import Spots from './Spots';
import BottomNav from './BottomNav';

export default class Schedule extends Component{
    constructor(props){
        super(props);

        this.state = {
            slider: 25
        };
    }

    onChangeHandler(e, val){
        this.setState({slider: val});
        this.props.onUpdate(this.state.slider);
    }

    onDragStopHandler(e){
        this.props.onDragStop(this.state.slider);
    }

    render(){
        return(
            <div style={{height: '100%'}} className="schedule">
                <Stepper activeStep={this.props.step}>
                    <Step>
                        <StepLabel>Select start position</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Choosing Schedule</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirm</StepLabel>
                    </Step>
                </Stepper>
                <Slider 
                    axis='y'
                    style={{
                        height: '33vh', 
                        width: '18px', 
                        position: 'absolute',
                        right: '10px',
                        display: 'flex' 
                    }}
                    min={0}
                    max={50}
                    step={0.5}
                    defaultValue={25}
                    onChange={this.onChangeHandler.bind(this)}
                    onDragStop={this.onDragStopHandler.bind(this)}
                />
                {
                    this.props.step > 1 ? 
                    <Spots 
                        spots={this.props.spots} 
                        onSpotClick={this.props.onSpotClick}
                        onHover={this.props.onHover}
                        onLeave={this.props.onLeave}
                    /> : null
                }
                {
                    this.props.step > 1 ? 
                    <BottomNav 
                        onSend={this.props.onSend}
                        undo={this.props.undo}
                    /> : null
                }
                
            </div>
        );
    }
}
