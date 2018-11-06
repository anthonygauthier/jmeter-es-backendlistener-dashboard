import React, { Component } from 'react';
import Settings from '@material-ui/icons/Settings'
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(event) {
    // use of callback to make sure the state has been set before calling parent component
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.handleChildState(this.state);
    }); 
  };

  render() {
    return (
      <Drawer>
        <div
          tabIndex={0}
          role="button"
        >
          <List>
            <ListItem button>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  };
}

export default SideMenu;