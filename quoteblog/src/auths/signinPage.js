import {useState} from 'react'
import axios from 'axios'
import {Form, Button, Spinner} from 'react-bootstrap'
import { useHistory } from 'react-router';


export default function SignIn() {

    const [ph, setPh] = useState("+91");
    const [l, setL] = useState(0);
    const hist = useHistory();


    function changeOTP(e){
        e.preventDefault();
        setPh(e.target.value);
    }

     async function sendOTP(e){

        e.preventDefault();
        if(ph){
            setL(1);
            const {data} = await axios.post('/otp/getotp', {phone : ph});
             if(data === 'pending'){
                hist.push('/verify/'+data+'/'+ph);
            }
            else{
                alert('error');
            }
        }
        setL(0);
        setPh("");
    }

    
  return (
      <div id="signinPage">
          <h3 style={{marginTop : "5%"}}>
              Vidyayan
          </h3>
          <h5> let's get started</h5>
<Form >

  <Form.Group className="mb-3" controlId="formBasicEmail" style={{width  :"50vw", textAlign:"center", margin : "0 auto"}}>
  <Form.Text>
     Enter your mobile number to sign in to your account
    </Form.Text>
    <Form.Control type="tel" placeholder="Enter your mobile number" 
    value={ph}
    onChange = {changeOTP}
    style={{background : "#5ef2b4", textAlign : "center", border : "0"}}
    />
    <hr style={{width : "45vw", opacity : "1" ,backgroundColor : "black" ,margin : "0 auto"}}/>

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
  {'please wait while we send otp'}
  </>
:
<Button 
style={{background : "blue", fontWeight : "bolder", borderRadius : "24px"}}
         // style={{width : "179px", height : "52px", borderRadius : "24px"}}
          className ="signinButton" type="submit" onClick = {sendOTP}>
             Next
</Button>

}
</Form>
      </div>
  );
}




