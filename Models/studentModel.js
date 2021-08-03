const mongoose = require("mongoose");

const studentSchema = {
  _id : String,
  name : String,
  fatherName : String,
  gender : String,
  dob : String,
  email : String,
  address : String,
  city : String,
  pincode : String,
  class : String,
  board : String,
  stream : String,
  enrolledClasses : [],
  myTutors : [],
  reqTutors : [],
}

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
