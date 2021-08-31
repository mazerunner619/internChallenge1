const mongoose = require("mongoose");

const studentSchema = {
  role : String,
  name : String,
  gender : String,
  dob : String,
  email : String,
  phone : String,
  password : String,

  enrolledClasses : [{
    type:  mongoose.Schema.Types.ObjectId,
    ref : "Classroom"
  }],
  turnedAssignments :  [
    {
    assignment : {
    type:  mongoose.Schema.Types.ObjectId,
    ref : "Assignment"
  },
  checked : {
    type : Boolean,
    default : false
  },
remarks : String,
score : String
  }
],
  requestedClasses : [{
    type:  mongoose.Schema.Types.ObjectId,
    ref : "Classroom"
}],

}

module.exports = mongoose.model("Student", studentSchema);

