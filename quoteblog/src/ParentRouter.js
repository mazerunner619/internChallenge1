import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navi from './Navi';
import {BrowserRouter, Route} from 'react-router-dom'
import Signup from './auths/signup'
import { useContext } from 'react';
import AuthContext from './context/authContext';
import SigninPage from './auths/signinPage';
import OtpVerify from './auths/otpV';
import DashS from './auths/DashS';
import DashT from './auths/DashT';
import SignupS from './auths/signupS';
import SignupT from './auths/signupT';


function Router() {

  const {logged} =  useContext(AuthContext);
  console.log('logged or not : '+logged);

  return ( 
  <BrowserRouter>
      <Navi />
      
  <Route path = "/" exact>
        <SigninPage />
  </Route>
  <Route path="/dasht" component = {DashT} />
  <Route path="/dashs" component = {DashS} />
  <Route path="/signupS/:id" component ={SignupS} />
  <Route path="/signupT/:id" component = {SignupT}/>
  <Route path = "/verify/:ph" component={OtpVerify} />
  <Route path="/signup/:ph" component= {Signup} />
  
      </BrowserRouter>
  );

}

export default Router;



