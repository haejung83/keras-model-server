import React from 'react';
import { 
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem } from 'react-bootstrap';

class NavBarPlace extends React.Component {

  handleOnSelect = (eventType, eventKey) => {
    let evtMsg = null;

    switch(eventKey) {
      case 1:
        evtMsg = "webcam";
      break;
      case 2:
        evtMsg = "video";
      break;
      case 3.1:
        evtMsg = "preference";
      break;
      case 3.2:
        evtMsg = "about";
      break;
      default:
      break;
    }
    this.props.handleViewEvent(evtMsg);
  }

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            ML TestSuite
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav onSelect={evtKey => this.handleOnSelect("view", evtKey)}  >
            <NavItem eventKey={1} >WebCam</NavItem>
            <NavItem eventKey={2} >Video</NavItem>

            <NavDropdown eventKey={3} title="Settings" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Preference</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.2}>About</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBarPlace
