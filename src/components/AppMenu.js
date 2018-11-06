import React, { Component } from 'react';
import Settings from '@material-ui/icons/Settings'
import SideMenu from './SideMenu';
import MenuIcon from '@material-ui/icons/Menu'
import { AppBar, Toolbar, Typography, IconButton , Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

class AppMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  };

  handleChange(event) {
    // use of callback to make sure the state has been set before calling parent component
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.handleChildState(this.state);
    }); 
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon  onClick={this.toggleDrawer('left', true)} />
            </IconButton>
            <Typography variant="title" color="inherit">
              {this.props.appName}
            </Typography>
          </Toolbar>
        </AppBar>
        <SideMenu />
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
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
      </div>
    );
  };
}

export default AppMenu;