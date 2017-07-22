import React, {Component, PropTypes} from 'react';

export default class Spots extends Component{
    constructor(props){
        super(props);

        this.state = {
            style: new Array(20).fill(
                    /*position: 'absolute', 
                    bottom: '0', 
                    left: '50%',*/
                {
                    display: 'flex',
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'red'
                })
        }
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
                        <div key={index} 
                            className={`st2-item`} 
                            style={this.state.style[index]}
                            onClick={e => {this.onClick(e, index)}}>
                            {spot.name}
                        </div>);
                })
            }
            </div>
        );
    }

    /*componentDidMount(){
        let style = this.state.style;
        
        for(let i in style){
            let left = 85 / 10 * (parseInt(i)%10);
            console.log(left);
            style[i].left = `${left}%`;
            style[i].bottom = parseInt(i) > 9 ? '30%' : '15%';
        }
        console.log(style);
        this.setState({style});
    }*/
}
