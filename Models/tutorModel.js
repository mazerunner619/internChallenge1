const mongoose = require("mongoose");
const tutorSchema = {
  _id : String,
  name : String,
  farherName : String,
  Gender : String,
  dob : String,
  email : String,
  address : String,
  city : String,
  pincode : String,
  qualification : String,
  status : String,
  college : String,
  mode : String,
  class : String,
  language : String,
  subject : String,
  board : String,
  timing : String,
  occupation : String,
  chargeFrom : String,
  chargeTo : String,
  studentRequests : [],
  myStudents : [],
}

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
