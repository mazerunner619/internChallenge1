import {useState } from 'react'
import axios from 'axios'
import {Form, Button, Row, Col } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';

export default function Signup({match}) {

  const hist = useHistory();    
  const [user, setUser] = useState({
    _id : match.params.ph,
    fName : "",
    lName : "",
    ffName : "", 
    flName : "",
    address :"",
    city : "", 
    pincode : "",
    gender : "",
    email : "",
    dob: ""
    });

    function HandleChange(e){
      const {name, value} = e.target;
      setUser( prev => { return{...prev, [name] : value}
      });
    }

    async function signupStudent(e){
      e.preventDefault();
      if(user.fName && user.lName && user.ffName && user.flName && user.address && user.city && user.pincode && user.gender && user.email && user.dob){
        const {data} = await axios.post( 'http://localhost:5000/student' , user);
        alert('your id : '+data);
        hist.push('/signupS/'+data);
      }
      else{
        alert('Fill all the fields !');
      }
    }

    async function signupTutor(e){
      e.preventDefault();
      if(user.fName && user.lName && user.ffName && user.flName && user.address && user.city && user.pincode && user.gender && user.email && user.dob)
      {
        const {data} = await axios.post( 'http://localhost:5000/tutor' ,user);
        alert('your id : '+data);
        hist.push('/signupT/'+data);
      }
      else{
        alert('Fill all the fields !');
      }
    }
    
  return (
    <div id="signupPage">

<Form>

  <Row className= "mb-3">
    <Col>
      <Form.Control name="fName" placeholder="First name" onChange={HandleChange} required/>
    </Col>
    <Col>
      <Form.Control name="lName"placeholder="Last name" onChange={HandleChange} required/>
    </Col>
  </Row>
 
  <Row className= "mb-3">
    <Col>
      <Form.Control name="ffName" placeholder="Father's First name" onChange={HandleChange} required/>
    </Col>
    <Col>
      <Form.Control name="flName" placeholder="Father's Last name" onChange={HandleChange} required/>
    </Col>
  </Row>

  <Row className= "mb-3">
    <Col>

    <Form.Control as="select" name="gender"  onChange = {HandleChange} required>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>     
    </Form.Control>
    </Col>
    <Col>
    <Form.Control type="date" name="dob" onChange = {HandleChange} required/>  
</Col>
  </Row>

  <Row className= "mb-3">
    <Col>
      <Form.Control type="email" name="email" placeholder="Email Address" onChange={HandleChange} required/>
    </Col>
  </Row>
  <Row className= "mb-3">
    <Col>
      <Form.Control name="address" placeholder="Current Address" onChange={HandleChange} required />
    </Col>
  </Row>

  <Row className= "mb-3">
    <Col>
      <Form.Control name ="city" placeholder="City" onChange={HandleChange} required />
    </Col>
    <Col>
      <Form.Control name="pincode" placeholder="Pincode" onChange={HandleChange} required />
    </Col>
  </Row>
<Row style={{textAlign : "center"}}>
  <Col>
  <LinkContainer to="/signupS">
  <Button
  variant = "success"
  onClick = {signupStudent} 
  >
  Register as Student
  </Button>
  </LinkContainer>
  </Col>
  <Col>
  
  <LinkContainer to="/signupT">
  <Button onClick = {signupTutor}
  variant = "success">
  Register as Tutor
  </Button>
  </LinkContainer>
  </Col >
</Row>

</Form>

</div>

  );
}




