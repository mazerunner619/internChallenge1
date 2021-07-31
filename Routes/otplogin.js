const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');
const Tutor = require('../Models/tutorModel');
const jwt = require('jsonwebtoken');

router.get('/isLogged', async(req, res) => {
  const token = req.cookies.token;
  console.log(token);
  try{

      if(!token) {
          console.log('not logged in');
          return res.json(false);
      }
      //else verify the token with jwt secret key
      jwt.verify( token, process.env.JWT_SECRET_KEY );
      console.log('logged in');
      res.json(true);  //cookie is present with this token
  }catch(error){
      console.log(error);
      res.json(false);
  }

});

router.get('/current', async(req, res) => {
  const token = req.cookies.token;
  if(token){
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if(verified){
          const user = await Student.findById(verified.userId);
          if(user){
        //   console.log('current student : '+user);
          res.send(user);
          }
          else{
            const user = await Tutor.findById(verified.userId);
            // console.log('current tutor : '+user);
            res.send(user);
          }
      }
      else{
        //   console.log('null');
          res.send(null);
      }
  }
  else{
      console.log('null');
      res.send(null);
  }
});


router.post('/getotp',( req, res) => {
  const {phone} = req.body;
  console.log('getotp called with : '+phone);

  const accountSid = process.env.ACCOUNT_SID_TWILIO;
  const authToken = process.env.AUTH_TOKEN_TWILIO;
  const client = require('twilio')(accountSid, authToken);
  
  client.verify.services(process.env.VERIFY_SERVICE_TWILIO)
               .verifications
               .create({to: phone, channel: 'sms'})
               .then(verification => {
                console.log(verification.status);
                res.status(200).send(verification.status);
               });
});

router.post('/verifyotp',( req, res) => {
  const {token, phone} = req.body;
 
  const accountSid = process.env.ACCOUNT_SID_TWILIO;
  const authToken = process.env.AUTH_TOKEN_TWILIO;
  const client = require('twilio')(accountSid, authToken);

  client.verify.services(process.env.VERIFY_SERVICE_TWILIO)
  .verificationChecks
  .create({to: phone, code:token })
  .then(verification_check => {
    console.log(verification_check);
if(verification_check.status == 'approved'){
      //send jwt
  console.log('creating jwt with user id : '+phone);
  const token = jwt.sign({
    userId : phone,
    },
    process.env.JWT_SECRET_KEY 
    );
 return res.cookie( "token", token, {httpOnly : true}).send();
    }
  return res.send('failed');
  });
});

module.exports = router;
