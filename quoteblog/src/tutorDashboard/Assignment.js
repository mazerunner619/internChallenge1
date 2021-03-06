import { useState , useContext, useEffect} from 'react';
import {Modal, Button ,Spinner,ListGroup, Tab ,Table, Tabs, Form,Accordion,Card, Row, Col} from 'react-bootstrap'
import axios from 'axios';
import { useHistory } from 'react-router';
import AuthContext from '../context/authContext';
import {ImCross,ImCheckmark, ImCopy} from 'react-icons/im'
import {IoIosAdd} from 'react-icons/io';

import {MdContentCopy} from 'react-icons/md'
import { LinkContainer } from 'react-router-bootstrap';

import Eval from './EvaluateModal';

export default function Classroom({match}) {

    const {logged, getLogged, loggedUser} = useContext(AuthContext);

    const [evaluate, setEvaluate] = useState(false);
    const [toEvaluate, setToEvaluate] = useState({
      AID : match.params.id,
      SID : null,
      assignment : null
    });

    const [dataA, setDataA] = useState(null);
    const [assignmentS, setAssignmentS] = useState([]);
    const [classT, setClassT] = useState([]);
    const [classA, setClassA] = useState([]);
    const [classS, setClassS] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [reRender, setRerender] = useState(0);

    useEffect(()=>{

        const getAssignment = async()=>{
            setLoading(true);
            const {data} = await axios.get(`/auth/assignment/${match.params.id}/get`);
            setDataA(data);
            setAssignmentS(data.doneby);
            console.log('data',data);
            setClassS(data.enrolledStudents);
            setClassA(data.assignments);
            console.log('reqs',data.studentRequests);
            setLoading(false);
        }
        getAssignment();

}, [reRender]);

async function evaluateAssignment(assignment, SID){
    setToEvaluate({
      ...toEvaluate,
      assignment : assignment,
      SID
    });

    console.log('assign => ',toEvaluate)
    setEvaluate(true);
}

const submissionArray = assignmentS.map( cr => 
    <tr>
    <td onClick={()=>evaluateAssignment(cr.file.fileURL, cr.student._id)}
      style={{color : "blue", cursor : "crosshair"}} >{cr.student.name}</td>
    <td>{cr.student.email}</td>
    <td>{cr.student.phone}</td>
    <td>{cr.evaluated ?
     <div style={{color : "green"}}>YES</div>
     :
     <div style={{color : "red"}}>NO</div>
    }
    </td>
  </tr>
    );

return (
    <div>
        {
            loading ? <Spinner variant = "danger" style={{position : "absolute", left : "50%", top :"50%"}} animation="grow" role="status">             </Spinner>
          :
          <>

        <h1>Assignment Submissions</h1>
  <Table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Evaluated</th>
    </tr>
  </thead>
  <tbody>
  {submissionArray}
  </tbody>
</Table>
        
        </>    

}


<Eval
    show={evaluate}
    onHide={() => setEvaluate(false)}
       assignment = {toEvaluate}
      />

    </div>

);

  }