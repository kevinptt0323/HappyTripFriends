import React, {Component, PropTypes} from 'react';

export default class Spots extends Component{
    constructor(props){
        super(props);

        this.state = {
            style: new Array(20).fill(
                {
                    position: 'absolute', 
                    bottom: '0', 
                    left: '50%',
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'red',
                    transition: 'left 2s, bottom 2s'
                })
        }
    }

    render(){
        return (
            <div className="st2-center">
            {
                this.props.spots.map((spot, index) => {
                    return <div key={index} className={`st2-item`} style={this.state.style[index]}>{spot.name}</div>;
                })
            }
            </div>
        );
    }

    componentDidMount(){
        let {style} = this.state;

        for(let i in style){
            style[i].left = '85%';
            style[i].bottom = '30%';
        }
        this.setState({style});
    }
}
