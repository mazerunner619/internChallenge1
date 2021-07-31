import './App.css';
import {Navbar, Nav} from 'react-bootstrap'
import { useContext } from 'react';
import AuthContext from './context/authContext';
import {LinkContainer} from 'react-router-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router';

export default function Navi() {

  const {logged, getLogged , getLoggedUser, loggedUser} = useContext(AuthContext);
  const hist = useHistory();

  async function logout(e){
    e.preventDefault();
    await axios.get('http://localhost:5000/logout');
    getLogged();
    getLoggedUser();
    hist.push('/');
  }
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style= 
    {{
      padding : "1%",
fontStyle: "normal",
background: "#EC7B12",
letterSpacing : "5px",
textTransform : "uppercase"

}}>
  
  <Navbar.Brand href="/">
 Vidyayan{' '} 
  </Navbar.Brand>

  <Navbar.Toggle aria-controls="responsive-navbar-nav" />

  <Navbar.Collapse id="responsive-navbar-nav">

 <Nav  style = {{marginLeft : "auto"}}>


 {logged && loggedUser.mode && 
 <>
        <LinkContainer to = "/dasht">
        <Nav.Link>dashboard
        </Nav.Link>
        </LinkContainer>
        <LinkContainer to = "/">
        <Nav.Link onClick = {logout}>Logout
        </Nav.Link>
    </LinkContainer>
    </>
    }
    
 {logged && loggedUser.stream && 
 <>
        <LinkContainer to = "/dashs">
        <Nav.Link>dashboard
        </Nav.Link>
        </LinkContainer>
           <LinkContainer to = "/">
           <Nav.Link onClick = {logout}>Logout
           </Nav.Link>
       </LinkContainer>
       </>
        
    }

{!logged && 
    <LinkContainer to = "/">
        <Nav.Link>Login
        </Nav.Link>
    </LinkContainer>
}

    </Nav>

  </Navbar.Collapse>

</Navbar>


  );
}
