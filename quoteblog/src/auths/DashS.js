import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Tabs, Spinner,Tab , ListGroup, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function DashS() {

  
  const [l, setL] = useState(0);
  const [tutors, setTutors] = useState([]);

  const [loggedUser, setLoggedUser] = useState(undefined);
    const [reqT, setReqT] = useState([]);
  const [myT, setMyT] = useState([]);
  const [userClass, setUserClass] = useState(undefined);
  const [userBoard,setUserBoard ] = useState(undefined);

  const [logged, setLogged] = useState(0);

  const sendRequest = async(tutor) => {
    setL(1);
 await axios.post('/addStudentRequest',{ student : loggedUser, tutor : tutor });
 alert('request sent');
setL(0);
  }
  
useEffect( () => {

  const fetchAllTutors = async() => {
    const {data} = await axios.get('/gettutors');
    setTutors(data); // set tutors => all tutors form the database
    console.log('fetched tutors');
  }

  const getLoggedUserData = async() => {
      const {data} = await axios.get('/otp/current');
      if(data){
        setLoggedUser(data);
        setLogged(1);
        setUserClass(data.class);
        setUserBoard(data.board);
        setMyT(data.myTutors); // contains only id of the tutors
        setReqT(data.reqTutors);       
        console.log('fetched logged user');
      }
}

getLoggedUserData();
fetchAllTutors();
});



const myTutorsPosts = [];

  const filteredTutors = tutors.map( tutor =>{
    return(  
     <>
     { (tutor.class.indexOf(userClass) !== -1) && (tutor.board.indexOf(userBoard) !== -1) &&
  <Col lg ={3} md ={3} sm={6} xs={12}>
      <ListGroup style={{margin : "4%"}}>
          <ListGroup.Item 
           style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}>{tutor.name}
          </ListGroup.Item>
          <ListGroup.Item>Highest Qualification - {tutor.qualification}</ListGroup.Item>
          <ListGroup.Item>College - {tutor.college}</ListGroup.Item>
          <ListGroup.Item>Mode of Teaching - {tutor.mode}</ListGroup.Item>
          <ListGroup.Item>Subject - {tutor.subject}</ListGroup.Item>
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
                myT.find(o => o === tutor._id)?
                <ListGroup.Item
                style={{background : "lightgrey", color : "green", fontWeight : "bolder", textAlign :"center"}}
                >
                Already added
                </ListGroup.Item>
                :

                (
                  l?
                  <>
              <ListGroup.Item variant="secondary">
              <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
             </ListGroup.Item>

             </>
              :
              <>
              <ListGroup.Item
              style={{ background : "#E9922D", color : "white", fontWeight : "bolder", textAlign :"center"}}
              onClick = {() => {sendRequest(tutor);}}
              >
             Send Request
             </ListGroup.Item>
              </>
                
                )  

              )
}
    </ListGroup>
</Col>
  }
</>
    )
}
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



  const tutorsOnmyDash = tutors.filter( t => {
    return (myT.indexOf(t._id) !== -1);
  });


  const myTutors = tutorsOnmyDash.map( tutor =>
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

  

  // const myTutors = tutors.map( tutor => {
  //   return (
  //     <>
  //     {
  //   (myT.indexOf(tutor._id) !== -1) &&
  //   <Col lg ={3} md ={3} sm={6} xs={12}>
  //   <ListGroup style={{margin : "4%"}}>
  //   <ListGroup.Item  
  // style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}
  //   >{tutor.name}</ListGroup.Item>
  //   <ListGroup.Item>Highest Qualification - {tutor.qualification}</ListGroup.Item>
  //   <ListGroup.Item>College - {tutor.college}</ListGroup.Item>
  //   <ListGroup.Item>Mode of Teaching - {tutor.mode}</ListGroup.Item>
  //   <ListGroup.Item>Timing - {tutor.timing}</ListGroup.Item>
  //   <ListGroup.Item>Fee - Rs{tutor.chargeFrom} - {tutor.chargeTo}</ListGroup.Item>
  // </ListGroup>
  // </Col> 
  //     }
  //     </>
  //   )
  // });



  var feedsArray = [];

   tutorsOnmyDash.map( tutor => {
    const sc = tutor.scheduledClasses;
    for(let i =0 ; i < sc.length ; i++){
      feedsArray.push(sc[i]);
    }
    return sc;
  });



   
  return (

    <>
    {
      logged ?
<div id="dashboard">
<h1 style={{textDecoration : "underline"}}>{loggedUser.name}</h1>
<br/>

<Tabs
style={{fontWeight : "bolder"}}
defaultActiveKey="#link4" id="uncontrolled-tab-example" className="mb-3">

<Tab   
  eventKey="#link4" title="Feeds">
<Row>
<i style={{textAlign : "center", color : "white",  background : "#EC7B12"}}>your Tutors scheduled classes will be shown here </i>
</Row>

<Row style={{ margin : "0 auto"}}>

{
  feedsArray.map( feed => 

    <Col lg ={3} md ={3} sm={6} xs={12}>
    <ListGroup style={{margin : "4%"}}>
    <ListGroup.Item  
    style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}
    >{feed.tutorName}</ListGroup.Item>
    <ListGroup.Item>{feed.subject}</ListGroup.Item>
    <ListGroup.Item>{feed.class}</ListGroup.Item>
    <ListGroup.Item>{feed.timing}</ListGroup.Item>
    </ListGroup>
    </Col>
  
  )
}

</Row>


  </Tab>

  <Tab   
  eventKey="#link1" title="All Tutors">
    <Row>
    <i style={{textAlign : "center", color : "white",  background : "#EC7B12"}}>Tutors are automatically filtered based on your class and board</i>
    </Row>
  <Row style={{ margin : "0 auto"}}>
       {filteredTutors.length === 0 ? <h1 style={{color : "grey"}}>Empty</h1> : filteredTutors}
</Row>

  </Tab>

  <Tab eventKey="#link2" title="Requested Tutors">
    
    <Row style={{ margin : "0 auto"}}>   
    {requestedTutors.length === 0 ? <h1 style={{color : "grey"}}>No Pending Requests</h1> : requestedTutors}
    </Row>

  </Tab>

  
  <Tab eventKey="#link3" title="My Tutors">
    
  <Row style={{ margin : "0 auto"}}>   
  {myTutors.length === 0 ? <h1 style={{color : "grey"}}>No Tutors Added</h1> : myTutors}
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
