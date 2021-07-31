import {useState,useEffect} from 'react'
import axios from 'axios'
import { Button, Tabs,Tab , Spinner, ListGroup, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'


export default function DashT() {

  const [loggedUser, setLoggedUser] = useState(undefined);
  const [myS, setMyS] = useState([]);
  const [reqS, setReqS] = useState([]);
  const [logged, setLogged] = useState(0);

  useEffect( () => {
    const getLoggedUserData = async() => {
        const {data} = await axios.get('/otp/current');
        if(data){
          setLoggedUser(data);
          setLogged(1);
          setMyS(data.myStudents);
          setReqS(data.studentRequests);
        }
  }

  getLoggedUserData();
  
  }, []);
 

   const acceptRequest = async(student) => {
    await axios.post('/acceptRequest',{ student : student, tutor : loggedUser });
  }

   const deleteRequest = async(student) => {
    await axios.post('/deleteRequest',{ student : student, tutor : loggedUser });
  }

const reqArr = reqS.map( s =>

  <Col lg ={3} md ={6} sm={6} xs={12}>
  <ListGroup style={{margin : "4%"}}>
  <ListGroup.Item 
   style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}
   >{s.name}</ListGroup.Item>
  <ListGroup.Item>Class - {s.class}</ListGroup.Item>
  <ListGroup.Item>Stream - {s.stream}</ListGroup.Item>
  <ListGroup.Item>Board - {s.board}</ListGroup.Item>
  <ListGroup.Item>Pincode - {s.pincode}</ListGroup.Item>
  <ListGroup.Item>
    <Row>
      <Col className="text-center">
      <a href="/dasht" style={{textDecoration : "none"}}>
  <Button variant="success" onClick={() => acceptRequest(s)}>
      Accept
    </Button>
    </a>

    </Col>
    <Col className="text-center">
    <a href="/dasht" style={{textDecoration : "none"}}>
    <Button variant="danger" onClick={() => deleteRequest(s)}>
      Delete
    </Button>
    </a>
    </Col>
    </Row>
  </ListGroup.Item>
</ListGroup>
</Col>
);


const myArr = myS.map( s =>

  <Col lg ={3} md ={6} sm={6} xs={12}>
  <ListGroup style={{margin : "4%"}}>
  <ListGroup.Item  style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}
  >{s.name}</ListGroup.Item>
  <ListGroup.Item>Grade - {s.class}</ListGroup.Item>
  <ListGroup.Item>Board - {s.board}</ListGroup.Item>
  <ListGroup.Item>Email - {s.email}</ListGroup.Item>
  <ListGroup.Item>Mobile - {s._id}</ListGroup.Item>
  <ListGroup.Item>Address - {s.address}</ListGroup.Item>
  <ListGroup.Item>City - {s.city}</ListGroup.Item>
  <ListGroup.Item>Pincode - {s.pincode}</ListGroup.Item>
</ListGroup>
</Col>
);


  return (

    <>

    {
      logged ? 
    
  <div id="dashboard">
    <h1>{loggedUser.name}</h1>

<Tabs 
style={{fontWeight : "bolder"}}
defaultActiveKey="#link1" id="uncontrolled-tab-example" className="mb-3">
  <Tab eventKey="#link1" title="Student Requests">
    
  <Row style={{ margin : "0 auto"}}>
    {reqArr.length === 0 ? <h1 style={{color : "grey", position :"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}>You have no pending requests</h1> : reqArr}
</Row>

  </Tab>
  <Tab eventKey="#link2" title="My Students">
    
  <Row style={{ margin : "0 auto"}}>   
  {myArr.length === 0 ? <h1 style={{color : "grey", position :"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}>You have no students</h1> : myArr}
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
