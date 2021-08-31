import { useState , useContext, useEffect} from 'react';
import {Modal, Button ,Spinner,ListGroup, Tab ,Table, Tabs, Form,Accordion,Card, Row, Col} from 'react-bootstrap'
import axios from 'axios';
import { useHistory } from 'react-router';
import AuthContext from '../context/authContext';
import {ImCross,ImCheckmark, ImCopy} from 'react-icons/im'

import {MdContentCopy} from 'react-icons/md'

export default function Classroom({match}) {

    const {logged, getLogged, loggedUser} = useContext(AuthContext);
    const [classData, setClassData] = useState({});
    const [classT, setClassT] = useState([]);
    const [classA, setClassA] = useState([]);
    const [classS, setClassS] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [reRender, setRerender] = useState(0);
    const [submitFile, setSubmitFile] = useState(null);
    const [turnedAssignment, setTurnedAssignment] = useState([]);
  
  async function turnin(e, AID){
      if(!submitFile)alert('please select your file to submit');
      else{
      setUploading(true);
      const dummyForm = new FormData();
      dummyForm.append('assignment',submitFile);
      const {data} = await axios.post(`/auth/${loggedUser._id}/assignment/${AID}/submit`, dummyForm);
      
      alert(data.message);
      setUploading(false);
      getLogged();
      // setRerender(reRender===0?1:0);
      }
  }

    useEffect(()=>{
// getLogged();
        const getClass = async()=>{
            setLoading(true);
            const {data} = await axios.get(`/auth/student/classroom/${match.params.id}`);
            console.log('data',data);
            setClassData(data);
            setClassS(data.enrolledStudents);
            setClassA(data.assignments);
            setLoading(false);
        }
        getClass();
        setTurnedAssignment(loggedUser.turnedAssignments);
        console.log('setTurnedAssignment', setTurnedAssignment);

}, [reRender, turnedAssignment.length]);

    const copytoclipboard = (e)=>{
        navigator.clipboard.writeText(e.target.id);
          alert('copied');
    }

    const studentArr = classS.map(cr=>
    <tr>
      <td>{cr.name}</td>
      <td>{cr.email}</td>
      <td>{cr.phone}</td>
    </tr>
);

const turnedAssignmentsID = turnedAssignment.map( TA => TA.assignment);

const assignmentArr = classA.map( CLASS => 

  <Col sm={10} md={6} lg={4}>
  <Card className="mx-2 my-3 p-3 classCards" bg="light">
      <a href={CLASS.file.fileURL} target="_blank" rel="noreferrer"><Card.Img variant="top" src={CLASS.file.fileURL} /></a>
  <Card.Body>
  <Card.Title>{CLASS.topic}</Card.Title>

      <Card.Text>
     {CLASS.description}
      </Card.Text>
      <Form enctype="multipart/form-data">
      <Form.File id="exampleFormControlFile1" name="assignment" onChange={(e)=>setSubmitFile(e.target.files[0])}/>
      </Form>
      <br/>

      {
          (turnedAssignmentsID.indexOf(CLASS._id) !== -1)?
          <Button type="submit" disabled>Turned in</Button>
          :
          <Button type="submit" onClick={(e)=>turnin(e, CLASS._id)}>Turn in Now</Button>
      }
    
  </Card.Body>
  </Card>
  </Col>
);

return (
    <div>
        {
            loading ? <Spinner variant = "danger" style={{position : "absolute", left : "50%", top :"50%"}} animation="grow" role="status"></Spinner>
          :
          <>
        <h1>Classroom Summary</h1>
<Tabs defaultActiveKey="classroom" id="uncontrolled-tab-example" className="m-3 p-3">
  <Tab className="classroom-tabs" eventKey="classroom" title="Summary">
        <>
    <ListGroup as="ul">
    <ListGroup.Item as="li" active>{classData.className}<p style={{display : "inline", float : "right"}}><b>Classroom ID</b>{' : '}<MdContentCopy id={classData.classroomID} onClick = {(e)=>copytoclipboard(e)}/>{classData.classroomID}</p></ListGroup.Item>
    <ListGroup.Item as="li" >{classData.subject}</ListGroup.Item>
    <ListGroup.Item as="li"><b>Assignments : {classA.length-turnedAssignment.length} pending of {classA.length}</b></ListGroup.Item>
    <ListGroup.Item as="li"><b>Enrolled : {classS.length}</b></ListGroup.Item>
    </ListGroup>
    </>
  </Tab>

  <Tab eventKey="assignment" title="Assignments">

<Row style={{ margin : "0 auto"}}>
      {
      
      assignmentArr.length>0 ?
      assignmentArr : <h2> no Assignments in this class ! </h2>
}
  </Row>

  </Tab>


  <Tab className=".classroom-tabs" eventKey="students" title="Students">
  <Table>
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