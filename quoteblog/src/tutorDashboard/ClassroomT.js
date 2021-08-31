import { useState , useContext, useEffect} from 'react';
import {Modal, Button ,Spinner,ListGroup, Tab ,Table, Tabs, Form,Accordion,Card, Row, Col} from 'react-bootstrap'
import axios from 'axios';
import { useHistory } from 'react-router';
import AuthContext from '../context/authContext';
import {ImCross,ImCheckmark, ImCopy} from 'react-icons/im'
import {IoIosAdd} from 'react-icons/io';

import {MdContentCopy} from 'react-icons/md'
import { LinkContainer } from 'react-router-bootstrap';

export default function Classroom({match}) {

    const {logged, getLogged, loggedUser} = useContext(AuthContext);
    const [classData, setClassData] = useState({});
    const [classR, setClassR] = useState([]);
    const [classT, setClassT] = useState([]);
    const [classA, setClassA] = useState([]);
    const [classS, setClassS] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [reRender, setRerender] = useState(0);


  const [classForm, setClassForm] = useState({
    topic  :"",
    subject : "",
    description : "",
    assignment : null
  });
  
  function changeClassForm(e){
    const {name, value} = e.target;
    if(name === "assignment"){
      setClassForm({
        ...classForm,
        assignment : e.target.files[0]
      });
    }else{
    setClassForm({...classForm, [name] : value});
    }
  }

    useEffect(()=>{

        const getClass = async()=>{
            setLoading(true);
            const {data} = await axios.get(`/auth/classroom/${match.params.id}`);
            console.log('data',data);
            setClassData(data);
            setClassS(data.enrolledStudents);
            setClassR(data.studentRequests);
            setClassA(data.assignments);
            console.log('reqs',data.studentRequests);
            setLoading(false);
        }
        getClass();
        console.log('classData',classData);
}, [reRender]);

    const copytoclipboard = (e)=>{
        navigator.clipboard.writeText(e.target.id);
          alert('copied');
    }

    const createAssignment = async(e)=>{

      e.preventDefault();
      const dummyForm = new FormData();
      dummyForm.append('assignment',classForm.assignment);
      dummyForm.append('topic',classForm.topic);
      dummyForm.append('subject',classForm.subject);
      dummyForm.append('description',classForm.description);

      console.log(classForm);
      setUploading(true);
      const {data} = await axios.post(`/auth/classroom/${match.params.id}/new/assignment`, dummyForm);
      alert(data.message);
      console.log(data);
      setUploading(false);
      setRerender(reRender === 0 ? 1:0);
    }

    const acceptRequest = async(e, SID)=>{
        const {data} = await axios.post(`/auth/${match.params.id}/requests/${SID}/accept`);
        console.log(data);
        setRerender(reRender === 0 ? 1:0);
    }

    
    const rejectRequest= async(e, SID)=>{
        const {data} = await axios.post(`/auth/${match.params.id}/requests/${SID}/reject`);
        console.log(data);
        setRerender(reRender === 0 ? 1:0);
    }

const reqArr = classR.map(cr=>
    <>
    <li> 
    <p style={{display : "inline", float : "left"}}>{cr.name}</p>
    <div style={{float:"right"}}>
    <Button onClick = {(e)=>acceptRequest(e,cr._id)} variant="success" style={{marginRight : "5px"}}>
        <ImCheckmark/>
    </Button>
    <Button onClick = {(e)=>rejectRequest(e,cr._id)} variant="danger" >
        <ImCross/>
    </Button>
    </div>
    </li>
    <br/>
    </>
    );

    const studentArr = classS.map(cr=>
    <tr>
      <td>{cr.name}</td>
      <td>{cr.email}</td>
      <td>{cr.phone}</td>
    </tr>
);

const assignmentArr = classA.map( CLASS => 

  <Col sm={10} md={6} lg={4}>
  <Card className="mx-2 my-3 p-3 classCards" bg="light">
      <a href={CLASS.file.fileURL} target="_blank" rel="noreferrer"><Card.Img variant="top" src={CLASS.file.fileURL} /></a>
  <Card.Body>
  <Card.Title>{CLASS.topic}</Card.Title>
      <Card.Text>
     {CLASS.description}
      </Card.Text>
      <div className="my-3" style={{color: 'goldenrod'}}>
     <b>{CLASS.doneby.length}</b> Submissions  till now<br/>
     {/* <ul>
       <li>
       {
          CLASS.doneby.map(done => 
            <>
          {done.student.name }<a href={done.file.fileURL}>see work</a>
          </>
          )
        }
        </li>
     </ul> */}
      </div>
      <LinkContainer to = {'/assignment/'+CLASS._id} style= {{ cursor : "pointer" }}>
        <Button variant="primary">Open</Button>
      </LinkContainer>
  </Card.Body>
  </Card>
  </Col>
);

return (
    <div>
        {
            loading ? <Spinner variant = "danger" style={{position : "absolute", left : "50%", top :"50%"}} animation="grow" role="status">             </Spinner>
          :
          <>
        <h1>Classroom Summary</h1>
<Tabs defaultActiveKey="classroom" id="uncontrolled-tab-example" className="m-3 p-3">
  <Tab className="classroom-tabs" eventKey="classroom" title="Summary">
        <>
    <ListGroup as="ul">
    <ListGroup.Item as="li" active>{classData.className}<p style={{display : "inline", float : "right"}}><b>Classroom ID</b>{' : '}<MdContentCopy id={classData.classroomID} onClick = {(e)=>copytoclipboard(e)}/>{classData.classroomID}</p></ListGroup.Item>
    <ListGroup.Item as="li" >{classData.subject}</ListGroup.Item>
    <ListGroup.Item as="li"><b>Assignments : {classA.length}</b></ListGroup.Item>
    <ListGroup.Item as="li"><b>Enrolled : {classS.length}</b></ListGroup.Item>
    <ListGroup.Item as="li" ><b>Requests : {classR.length}</b>
    <ul>
        {reqArr}
    </ul>
    </ListGroup.Item>
    </ListGroup>
    </>
  </Tab>

  <Tab eventKey="assignment" title="Assignments">

<Accordion className="m-3">
<Card className = "accor-card" style={{border : "0"}}>
<Card.Header style={{background : "white", border : "0",textAlign : "start"}}>
<Accordion.Toggle variant ="none" as={Button} eventKey="0" className="p-0 m-0">
<IoIosAdd className="plusButton" style={{padding: "0" ,fontSize : "200%", background :"orange", color : "white",borderRadius :"50%", border : "1px solid orange"}}/>
{' '}<b>new assignment</b>
</Accordion.Toggle>
    </Card.Header>
  <Accordion.Collapse eventKey="0" >
    <>
  <Form enctype="multipart/form-data" className="p-3 m-0" style={{backgroundColor : "rgba(0,0,0,0.05)",border : "1px solid orange", borderRadius : "10px"}}>
  <h4 atyle={{textAlign : "center"}}>Upload New Assignment</h4>
      <Form.Label style = {{float : "left"}}>Topic</Form.Label>
      <Form.Control placeholder="topic" name="topic" value={classForm.topic} onChange ={changeClassForm} />    
      <Form.Label style = {{float : "left"}}>Chapter</Form.Label>
      <Form.Control placeholder="chapter" name="subject" value={classForm.subject} onChange ={changeClassForm} />   
      <Form.Label style = {{float : "left"}}>Description</Form.Label>
      <Form.Control as="textarea" rows={3} placeholder="give a short description" name="description" value={classForm.description} onChange ={changeClassForm} />   
 <br/>
      <Form.File id="exampleFormControlFile1" name="assignment" onChange={changeClassForm}/>

      <div className = "p-3">

<Button variant = "success" onClick = {createAssignment} >
  {uploading ? <Spinner
    as="span"
    animation="border"
    size="lg"
    role="status"
    aria-hidden="false"
  /> : "Submit" 
  }
  </Button>
      </div>
    </Form>
    </>
      </Accordion.Collapse>
      </Card>
 
</Accordion>


<Row style={{ margin : "0 auto"}}>
      {
      
      assignmentArr.length>0 ?
      assignmentArr : <h2> no Assignments in this class ! </h2>
}
  </Row>

  </Tab>

  <Tab className=".classroom-tabs" eventKey="students" title="Students">
  <Table striped bordered hover>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
    </tr>
  </thead>
  <tbody>
  {studentArr}
  </tbody>
</Table>

  </Tab>

</Tabs>  
</>    

}
    </div>

);

  }