import {useState,useEffect} from 'react'
import axios from 'axios'
import { Button, Tabs,Tab ,Accordion, Spinner, Form, Card, ListGroup, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'


export default function DashT() {

  const [confirm, setConfirm] = useState(false);
  const [l, setL] = useState(0);


  const [loggedUser, setLoggedUser] = useState(undefined);
  const [logged, setLogged] = useState(0);
  const [myS, setMyS] = useState([]);
  const [reqS, setReqS] = useState([]);
  const [myClasses, setMyclasses] = useState([]);
  const [mySubject, setMySubject] = useState("");
  
  //from totors db get scheduled classes
  const [mySC, setMySC] = useState([]);

  // for form fillup
  const [schedule, setSchedule] = useState({
    tutorName : "",
    class : "",  // from logged tutor data choose the class
    timing : "", 
    subject : "", // from logged tutor data choose the class
  });

  const available = ['6-7am', '7-8am', '8-9am', '9-10am', '10-11am', '11-12am', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm','5-6pm', '6-7pm', '7-8pm'];

  useEffect( () => {
    const getLoggedUserData = async() => {
        const {data} = await axios.get('/otp/current');
        if(data){
          setLoggedUser(data);
          setLogged(1);
          setMyS(data.myStudents);
          setReqS(data.studentRequests);
          setMySC(data.scheduledClasses);
          setMyclasses(data.class);
          setMySubject(data.subject);
        }
  }
  getLoggedUserData();

  });

  
  function changeTutorForm(e){
    const {name, value} = e.target;
    setSchedule( prev => { return{...prev, [name] : value}});
  }
  
  const newClassSchedule = async(student) => {
    setL(1);
    schedule.subject = mySubject;
    schedule.tutorName = loggedUser.name;
    const {data} = await axios.post('/scheduleClass',{tutor : loggedUser , newClass : schedule});
    if(data === '0')alert("serverside error! please try again");
    // setL(0);
    //window.location.reload();
  }

  
  const cancelClass = async(student) => {
    // schedule.subject = mySubject;
    // const {data} = await axios.post('/scheduleClass',{tutor : loggedUser , newClass : schedule});
    // // hist.push('/dasht');
    // if(data === '0')alert("serverside error! please try again");
    ////window.location.reload();
  }


   const acceptRequest = async(student) => {
    await axios.post('/acceptRequest',{ student : student, tutor : loggedUser });
    alert('requested accepted');
    //window.location.reload();
  }

   const deleteRequest = async(student) => {
    await axios.post('/deleteRequest',{ student : student, tutor : loggedUser });
    alert('requested deleted');
    //window.location.reload();
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
  <Button variant="success" onClick={() => acceptRequest(s)}>
      Accept
    </Button>

    </Col>
    <Col className="text-center">
    <Button variant="danger" onClick={() => deleteRequest(s)}>
      Delete
    </Button>
    </Col>
    </Row>
  </ListGroup.Item>
</ListGroup>
</Col>
);


  const classArr = myClasses.map(c => 
  <option value={c}>{c}</option>
    );

    const avaiilArr = available.map(c => 
      <option value={c}>{c}</option>
    );

  const scArr = mySC.map( s => 

  <Col lg ={3} md ={6} sm={6} xs={12}>
  <ListGroup style={{margin : "4%"}}>
  <ListGroup.Item  style={{background : "#E9922D", color : "black", fontWeight : "bolder", textAlign :"center"}}
  >{s.subject}</ListGroup.Item>
  <ListGroup.Item>Std - {s.class}</ListGroup.Item>
  <ListGroup.Item>{s.timing}</ListGroup.Item>
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
<h1 style={{textDecoration : "underline"}}>{loggedUser.name}</h1>

<Tabs 
style={{fontWeight : "bolder"}}
defaultActiveKey="#link3" id="uncontrolled-tab-example" className="mb-3">

<Tab eventKey="#link3" title="Scheduled Class">

<Accordion className="m-3">

  <Card className = "accor-card" style = {{marginTop : "2%",border : "1px solid orange", background : "rgb(0,0,0, 0.1)"}}>
  <Card.Header style = {{ padding : "0",margin : "0",width : "100%", borderRadius : "20px"}}>
      <Accordion.Toggle as={Button} eventKey="0" className="Accor"  style={{margin : "0", padding : "2%", backgroundColor : "orange",  width : "100%"}}>
        Schedule a Class
      </Accordion.Toggle>
    </Card.Header>
      
    <Accordion.Collapse eventKey="0" >


    <Form >
      <Row className = "p-3">
        <Col>
        <Form.Control as="select" name="class" onChange ={changeTutorForm}>
      <option value="" style={{color : "green"}} >Select Class</option>
        {classArr}    
    </Form.Control>
        
        </Col>

        <Col>
      <Form.Control as="select" name="timing" onChange ={changeTutorForm}>
        <option value="">Schedule Time</option>
        {avaiilArr}    
    </Form.Control>
    </Col>
      </Row>
      <div className = "p-3">

      <Form.Group>
  <Form.Check style={{display : "inline", float : "left", marginRight : "20px"}}
type="checkbox"
name="confirm"
label = "confirm"
onChange ={()=>setConfirm(!confirm)}
/>
</Form.Group>

{
    l?
    <>
    <Button variant="danger" disabled>
    <Spinner
      as="span"
      animation="border"
      size="lg"
      role="status"
      aria-hidden="true"
    />
  </Button>
<br/>
  {'processing...'}
  </>
:
<Button variant = "success" disabled = {!confirm} onClick = {newClassSchedule} >Schedule</Button>

}
      </div>
    </Form>

      </Accordion.Collapse>
      </Card>
 
</Accordion>


    <Row style={{ margin : "0 auto"}}>
      {scArr.length === 0 ? <Col><h1 style={{color : "grey", textAlign:"center"}}>No Scheduled Classes</h1></Col> : scArr}
  </Row>
  
    </Tab>


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
<p>click <a href="/"> here </a> 
to login again if taking too long</p>
</div>

}
</>
  );
}
