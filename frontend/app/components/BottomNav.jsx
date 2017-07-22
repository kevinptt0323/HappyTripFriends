import React, {Component, PropTypes} from 'react';
import Send from 'material-ui/svg-icons/content/send';
import Undo from 'material-ui/svg-icons/content/undo';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

export default class BottomNav extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Paper zDepth={1} className="bottom-nav">
                <BottomNavigation selectedIndex={1}>
                    <BottomNavigationItem
                        label="Undo"
                        icon={<Undo />}
                        onClick={e => this.props.undo()}
                    />
                    <BottomNavigationItem
                        label="Submit"
                        icon={<Send />}
                        onClick={e => this.props.onSend()}
                    />
                </BottomNavigation>
            </Paper>);
    }
}
