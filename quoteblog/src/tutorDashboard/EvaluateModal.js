import { useState , useContext} from 'react';
import {Modal, Button, CloseButton ,Row, Image,Form} from 'react-bootstrap'
import axios from 'axios';
import { useHistory } from 'react-router';

export default function Evaluate({assignment, onHide, show}) {

  const [evaluate, setEvaluate]=  useState({
    remarks : "",
    score : "7"
  });

async function HandleClick(e){
// e.preventDefault();
console.log('assignment====>',assignment);
const {data} =  await axios.post(`/auth/assignment/${assignment.AID}/evaluate/${assignment.SID}`, evaluate);
console.log('data => ',data);

// window.location.reload();
}

function handleChange(e){
  let {name, value} = e.target;
  if(name === "score") 
  if(value>10)value = 10;
  if(value<0)value=0;

      setEvaluate({
        ...evaluate,
    [name] : value
      });
}

return (
  <Modal
    show = {show}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter">
        Edit Your Post
      </Modal.Title>
      <Button variant="secondary" aria-hidden="true" onClick={onHide}>&times;</Button>

    </Modal.Header>
    <Modal.Body>
      <center>
      <Image src={assignment.assignment} thumbnail width="100vw" height="50vh" style={{border : "1px solid green",textAlign : "center"}}/>
      <br/>
      <a href={assignment.assignment} target="_blank" rel="noreferrer">open assignment</a>
      <hr/>
      </center>
     <Form style={{width : "100%"}}>   
    <Form.Group controlId="exampleForm.ControlTextarea1">
    <Form.Label style ={{color :"green"}}>Ramarks if any</Form.Label>
    <Form.Control as="textarea" rows="3" placeholder='any remarks for the assignment' required value={evaluate.remarks} onChange={handleChange} autocomplete="off" name = "remarks" />
    <Form.Label style ={{color :"green"}}>Score out of 10 </Form.Label>
    <Form.Control type="number" min="0" max="10" required   autocomplete="off" name = "score" value={evaluate.score} onChange={handleChange}/>
  </Form.Group>   
   </Form> 
    </Modal.Body>
    <Modal.Footer>
    <Button disabled block style={{marginTop : "2%", width : "100%", borderRadius : "20px"}} variant="success" onClick = {HandleClick} >Could not complete</Button>
    </Modal.Footer>
  </Modal>
);

  }