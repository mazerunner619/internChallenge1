import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Tabs, Spinner,Tab , ListGroup, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'


export default function DashS() {
  
  const [tutors, setTutors] = useState([]);

  const [loggedUser, setLoggedUser] = useState(undefined);
    const [reqT, setReqT] = useState([]);
  const [myT, setMyT] = useState([]);
  const [logged, setLogged] = useState(0);

  const sendRequest = async(tutor) => {
 await axios.post('/addStudentRequest',{ student : loggedUser, tutor : tutor });
// alert('request sent');
  }
          
  
useEffect( () => {

  const fetchAllTutors = async() => {
    const {data} = await axios.get('/gettutors');
    setTutors(data);
  }

  const getLoggedUserData = async() => {
      const {data} = await axios.get('/otp/current');
      if(data){
        setLoggedUser(data);
        setLogged(1);
        setMyT(data.myTutors);
        setReqT(data.reqTutors);
      }
}

fetchAllTutors();
getLoggedUserData();

}, []);

  const allTutors = tutors.map( tutor => 
  <Col lg ={3} md ={3} sm={6} xs={12}>
      <ListGroup style={{margin : "4%"}}>
          <ListGroup.Item 
           style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}>{tutor.name}
          </ListGroup.Item>
          <ListGroup.Item>Highest Qualification - {tutor.qualification}</ListGroup.Item>
          <ListGroup.Item>College - {tutor.college}</ListGroup.Item>
          <ListGroup.Item>Mode of Teaching - {tutor.mode}</ListGroup.Item>
          <ListGroup.Item>Timing - {tutor.timing}</ListGroup.Item>
          <ListGroup.Item>Fee - Rs{tutor.chargeFrom} - {tutor.chargeTo}</ListGroup.Item>
          {
          reqT.find(o => o._id === tutor._id)?
          <ListGroup.Item
          style={{background : "lightgrey", color : "red", fontWeight : "bolder", textAlign :"center"}}
          >
          Requested
          </ListGroup.Item>
          :
              (
                myT.find(o => o._id === tutor._id)?
                <ListGroup.Item
                style={{background : "lightgrey", color : "green", fontWeight : "bolder", textAlign :"center"}}
                >
                Already added
                </ListGroup.Item>
                :
                <a href="/dashs" style={{textDecoration : "none"}}>
                <ListGroup.Item
                style={{ background : "#E9922D", color : "white", fontWeight : "bolder", textAlign :"center"}}
                onClick = {() => {sendRequest(tutor);}}
                >
               Request
               </ListGroup.Item>    
               </a>          
              )
}
    </ListGroup>
</Col>
);




const requestedTutors = reqT.map( tutor => 
  <Col lg ={3} md ={3} sm={6} xs={12}>
  <ListGroup style={{margin : "4%"}}>
  <ListGroup.Item   style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}>
  {tutor.name}</ListGroup.Item>
  <ListGroup.Item>Highest Qualification - {tutor.qualification}</ListGroup.Item>
  <ListGroup.Item>College - {tutor.college}</ListGroup.Item>
  <ListGroup.Item>Mode of Teaching - {tutor.mode}</ListGroup.Item>
  <ListGroup.Item>Timing - {tutor.timing}</ListGroup.Item>
  <ListGroup.Item>Fee - Rs{tutor.chargeFrom} - {tutor.chargeTo}</ListGroup.Item>
</ListGroup>
</Col> 
  );


  const myTutors = myT.map( tutor => 
    <Col lg ={3} md ={3} sm={6} xs={12}>
    <ListGroup style={{margin : "4%"}}>
    <ListGroup.Item  
  style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}
    >{tutor.name}</ListGroup.Item>
    <ListGroup.Item>Highest Qualification - {tutor.qualification}</ListGroup.Item>
    <ListGroup.Item>College - {tutor.college}</ListGroup.Item>
    <ListGroup.Item>Mode of Teaching - {tutor.mode}</ListGroup.Item>
    <ListGroup.Item>Timing - {tutor.timing}</ListGroup.Item>
    <ListGroup.Item>Fee - Rs{tutor.chargeFrom} - {tutor.chargeTo}</ListGroup.Item>
  </ListGroup>
  </Col> 
    );


  return (

    <>
    {
      logged ?
<div id="dashboard">
<h1 style={{textDecoration : "underline"}}>{loggedUser.name}</h1>
<br/>

<Tabs
style={{fontWeight : "bolder"}}

defaultActiveKey="#link1" id="uncontrolled-tab-example" className="mb-3">
  <Tab   
  eventKey="#link1" title="All Tutors">
    
  <Row style={{ margin : "0 auto"}}>
       {allTutors.length === 0 ? <h1 style={{color : "grey"}}>Empty</h1> : allTutors}
</Row>

  </Tab>

  <Tab eventKey="#link2" title="Requested Tutors">
    
    <Row style={{ margin : "0 auto"}}>   
    {requestedTutors.length === 0 ? <h1 style={{color : "grey"}}>Empty</h1> : requestedTutors}
    </Row>

  </Tab>

  
  <Tab eventKey="#link3" title="My Tutors">
    
  <Row style={{ margin : "0 auto"}}>   
  {myTutors.length === 0 ? <h1 style={{color : "grey"}}>Empty</h1> : myTutors}
</Row>
  </Tab>
</Tabs>
</div>
:
  <div
  style={{textAlign : "center" ,position :"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}
  >
<Spinner
      as="span"
      animation="grow"
      size="lg"
      role="status"
      aria-hidden="false"
    />
  <p>click <Link to="/"> here </Link> 
to login again if taking too long</p>
  </div>

}
</>
  );
}
