import {useContext, useState } from 'react'
import axios from 'axios'
import {Form, Button} from 'react-bootstrap'
import { useHistory } from 'react-router';
import AuthContext from '../context/authContext';

export default function VerifyOTP({match}) {
  const [otp, setOtp] = useState("");
  const {getLogged, getLoggedUser} = useContext(AuthContext);

  const [ver, setVer] = useState(false);
  const hist = useHistory();

  function changeOtp(e){
    setOtp(e.target.value);
  }
  
  async function handleVerify(e){


    e.preventDefault();

    if(otp){

      setVer(true);
      const {data} = await axios.post('http://localhost:5000/otp/verifyotp', {token : otp, phone : match.params.ph});
      if(data === 'failed'){
        setVer(false);
        alert('wrong OTP');
        hist.push('/');
      }

      else{
        getLogged();
        getLoggedUser();
        const {data} = await axios.post('http://localhost:5000/exists', {_id : match.params.ph} ); 
        setVer(false);
        if(data === 'new'){
          hist.push('/signup/'+match.params.ph);
        }
        else{
          hist.push(data);
        }
      }

    }
    else{
      alert('enter otp');
    }
    setOtp("");
  }

  return (
    <div id="otpvPage">
          <h3 
          style={{
            color : "#EC7B12",
            width: "123px",
            height: "35px",
            fontWeight: "bold",
            fontSize: "30px",
            lineHeight: "35px",
            margin : "29px auto"
          }}>
              Vidyayan
              </h3>
          <h5 style={{color : "#EC7B12"}}> let's gain together</h5>

<Form style={{textAlign : "center", width : "100%"}}>

  <Form.Group className="mb-3" controlId="formBasicEmail">
  <Form.Text className="text-muted">
     <h4>Please Enter OTP sent to your mobile +91XXXXXX{match.params.ph.slice(9)}</h4>
    </Form.Text>
    <Form.Control type="text" size="lg" placeholder = "OTP" maxLength={6} value={otp} onChange = {changeOtp}
        style={{textAlign : "center", border : "0", letterSpacing : "5px", borderBottom : "2px solid black"}}
/>
 </Form.Group>
 
          <Button 
          disabled = {ver}
          onClick = {handleVerify}
          style={{ borderRadius : "24px", background : "#EC7B12",  fontWeight : "bolder"}}
           className ="signinButton" 
           >
              {ver? ('Verifying...') : ('Verify and Proceed')}
           </Button>
</Form>
      </div>
  );
}




