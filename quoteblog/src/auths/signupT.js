import { useState } from 'react'
import axios from 'axios'
import {Form, Button,Row,Col} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router';


export default function Exp({match}) {

  
    const hist = useHistory();
    const [confirm, setConfirm] = useState(false);
    const [info, setInfo] = useState({
      qualification : "",
      status:"",
      college : "",
      mode : "", 
      language:"",
      class:[],
      subject:"",
      board : "",
      occupation : "",
      timing : "",
      chargeFrom : "",
      chargeTo : ""
    });

    function changeTutorForm(e){
      const {name, value} = e.target;
      setInfo( prev => { return{...prev, [name] : value}});
    }

    async function handleS(e){
      e.preventDefault();
      if(info.board && info.class && info.college && info.language && info.mode && info.occupation && info.qualification && info.status && info.subject && info.timing && info.chargeFrom && info.chargeTo){
      const {data} = await axios.post('/tutordetails/'+match.params.id, info);
      alert(data);
      hist.push('/dasht');
      }
      else{
        alert('all fields are required')
      }
    }

    
  function handleClassCheck(e, index){
    tutorClasses.sort();
    const {checked, value} = e.target;
    if(checked){
      tutorClasses.push(value);
    }
    else{
      tutorClasses.splice(tutorClasses.indexOf(value), 1);
    }
    tutorClasses.sort();
    info.class = tutorClasses;
  }
  

const curOcc = ['Full Time Teacher', 'Freelancer', 'Working Professional', 'Colege Student', 'Not Working', 'Other'];
const higQ = ['BA', 'MA', 'BE', 'ME', 'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'BBA', 'MBA' ,'B.Arch', 'MBBS', 'MD', 'BDS', 'MDS', 'BPT', 'B.Pharm', 'M.Pharm', 'B.Com','M.Com', 'CA']
const boards = ['ICSE', 'CBSE', 'State'];
const subs = ['Mathematics','Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography', 'Economics', 'Civics', 'English', 'Hindi', 'Sanskrit'];
const available = ['6-7am', '7-8am', '8-9am', '9-10am', '10-11am', '11-12am', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm','5-6pm', '6-7pm', '7-8pm'];
const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
var tutorClasses = [];


const classArr = classes.map( (c, index) => 
<Form.Check style={{display : "inline", float : "left", marginRight : "20px"}}
type="checkbox"
name="classes"
label={c}
value={c}
onChange = {(e) => handleClassCheck(e, index)}
/>
);

const curOccArr = curOcc.map(c => 
  <option value={c}>{c}</option>
);

const higQArr = higQ.map(c => 
    <option value={c}>{c}</option>
);

const boardsArr = boards.map(c => 
  <option value={c}>{c}</option>
);

const subsArr = subs.map(c => 
  <option value={c}>{c}</option>
  );
  
  const avaiilArr = available.map(c => 
    <option value={c}>{c}</option>
  );
  return (



    <div id="signuptPage">
        {tutorClasses}
        <br/>
    <Form>

 <Row className= "mb-3">

    <Col>

    <Form.Control as="select" name="qualification" onChange ={changeTutorForm}>
      <option value="">Highest Qualification</option>
      {higQArr}
    </Form.Control>

    </Col>

    <Col>
         <Form.Control as="select" name="status"  onChange ={changeTutorForm}>
      <option value="">Status</option>
      <option value ="pursuing"> Pursuing</option>
      <option value="completed">Completed</option>      
    </Form.Control>

    </Col>

  </Row>
 
  <Row className= "mb-3">
    <Col>
      <Form.Control placeholder="College Name" name="college" onChange ={changeTutorForm} />
    </Col>
  </Row>

  <Row className= "mb-3">
    <Col>
  <Form.Control as="select" name="mode" onChange ={changeTutorForm}>
      <option value="">Mode of Teaching</option>
      <option value="online">Online</option>
      <option value="offline">Offline</option>  
    </Form.Control>
    </Col>

    <Col>
    
      <Form.Control as="select" name="language"  onChange ={changeTutorForm}>
        <option value="">Language</option>
        <option value="hindi">Hindi</option>
        <option value="english">English</option>     
        <option value="english, hindi">Both</option>      
    </Form.Control>

    </Col>
  </Row>
<hr/>
  <Row className= "mb-3">
<p style={{textAlign : "start"}}>Class</p>
<Col>    {classArr}    </Col>

  </Row>

  <Row className= "mb-3">
  <Col>
      <Form.Control as="select" name="subject" onChange ={changeTutorForm}>
        <option value=""> Subject</option>
        {subsArr}  
    </Form.Control>

    </Col>
        <Col>
      <Form.Control as="select" name="board" onChange ={changeTutorForm}>
        <option value="">Board</option>
     {boardsArr}    
    </Form.Control>
    </Col>
  </Row>
  <hr/>

  <Row className= "mb-3">
    
  <Col>
      <Form.Control as="select" name="timing" onChange ={changeTutorForm}>
        <option value="">Available Timing</option>
        {avaiilArr}    
    </Form.Control>
    </Col>
    <Col>
      <Form.Control as="select" name="occupation" onChange ={changeTutorForm}>
        <option value="">Current Occupation</option>
    {curOccArr}   
    </Form.Control>
    </Col>
  </Row>
  <Row className= "mb-3">
    <Col>
    <h5 style={{textAlign : "center"}}>Charges :- Rs</h5>
    </Col>
    <Col>
    <Form.Label style={{fontWeight : "bolder"}}>From</Form.Label>
      <Form.Control placeholder="per month" name="chargeFrom" onChange ={changeTutorForm} />
    </Col>
    <Col>
    <Form.Label style={{fontWeight : "bolder"}}>To</Form.Label>
      <Form.Control placeholder="per month" name ="chargeTo" onChange ={changeTutorForm}/>
    </Col>
  </Row>


  <hr/>
  <Form.Group>
  <Form.Check style={{display : "inline", float : "left", marginRight : "20px"}}
type="checkbox"
name="confirm"
label = "confirm"
onChange ={()=>setConfirm(!confirm)}
/>
</Form.Group>


<LinkContainer to="/signupT">
  <Button variant = "success"  type="submit" onClick = {handleS}>Submit</Button>
  </LinkContainer>

</Form>
</div>

  );
}
