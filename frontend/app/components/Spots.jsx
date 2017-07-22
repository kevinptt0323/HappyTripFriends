import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class Spots extends Component{
    constructor(props){
        super(props);

        this.state = {
            style: new Array(20).fill(
                {
                    transition: 'all 2s',
                })
        }

        this.btns = [];
    }

    onClick(e, index){
        console.log(index);
        this.props.onSpotClick(index);
    }

    render(){
        return (
            <div className="st2-center">
            {
                this.props.spots.map((spot, index) => {
                    return (
                            
                        <FlatButton label={spot.name} 
                            className={`st2-item st2-item-${index}`} 
                            style={this.state.style[index]}
                            onClick={e => {this.onClick(e, index)}}
                            onMouseEnter={e => this.props.onHover(index)}
                            onMouseLeave={e => this.props.onLeave()}
                            key={index} 
                        />
                        );
                })
            }
            </div>
        );
    }
}
