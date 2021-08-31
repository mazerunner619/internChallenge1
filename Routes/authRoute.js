const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../Models');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary');
require('dotenv/config');


//====================== cloudinary and multer setup
//cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

//upload to cloudinary
const upload_get_url = (image) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(image , (err, url) => {
        if (err) return reject(err);
        return resolve(url);
      });
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'my-uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-atif-' + Math.round(Math.random() * 1E9)
      console.log('filename',file.fieldname);
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
//   const upload = multer({ storage: storage });
const upload = multer({ storage : storage })
//====================== cloudinary and multer setup end



//===================== upload new assignment to class
router.post('/classroom/:classroomID/new/assignment', upload.single('assignment'),async(req, res, next) => {
    try{
        // console.log('new assignmnet',req.body.formdata);
        const {topic , subject , description } = req.body;
        console.log('new ass :=>',topic,subject, description);
        console.log('new file',req.file);

        const {classroomID} = req.params;
        const classroom = await db.Classroom.findById(classroomID);
 
        if(!classroom)
        return next({
            message : 'classroom not found  !',
            status : false
        });

        const FILE = req.file;
        const {public_id, secure_url} = await upload_get_url(FILE.path);   
        const file = {
            fileID : public_id,
            fileURL : secure_url
        }

        const newAss = await db.Assignment.create({
            topic , subject , description , file, classRoom : classroomID, creator : classroom.creator
        });

        classroom.assignments.push(newAss._id);
        await classroom.save();

        console.log('new Ass=>',newAss);
        console.log('classroom=>',classroom);
        res.json({
            message : 'assignment uploaded'
        });

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }


});

//====================submit assignment by student
router.post('/:SID/assignment/:AID/submit', upload.single('assignment') ,async(req, res, next) => {
try{

    console.log('submitting !');
    const {AID, SID} = req.params;
    const FILE = req.file;
    console.log('file=>', FILE);
    const assignment = await db.Assignment.findById(AID);
    const student = await db.Student.findById(SID);
    if(!assignment || !student)
    return next({
        message : 'Something went wrong !',
        status : false
    });

    const {public_id, secure_url} = await upload_get_url(FILE.path);   
    const file = {
        fileID : public_id,
        fileURL : secure_url
    };
    assignment.doneby.push({
        student : SID,
        file
    });
    await assignment.save();

    student.turnedAssignments.push({
        assignment : AID,
      checked : false,
    remarks : "",
    score : ""
      });

      await student.save();
      
    res.json({
        message : 'turned in successfully !'
    });


}catch(err){
    console.log(err);
    return next({
        message : err.message,
        status : false
    });
}
    
});

//=========================evaluate assignment => tutor
router.post('/assignment/:AID/evaluate/:SID', async(req, res, next) => {
    try{
    console.log('request received');
    console.log(req.body);
    console.log(req.params);
    const {SID, AID} = req.params;
    const {remarks, score} = req.body;

    let student = await db.Student.findById(SID);
    let assignment = await db.Assignment.findById(AID);

    if(!student || !assignment)
    return next({
        message:'something went wrong !',
        status : false
    });

    console.log(student.name);
    console.log(assignment.topic);

assignment.doneby.evaluated = true;
await assignment.save();

res.send('evaluated successfully');

}catch(err){
    console.log(err);
    return next({
        message : err.message,
        status : false
    });
}

});

//===================== CURRENT LOGGED USER if any
router.get('/current' ,async(req, res, next) => {
    try{

        const token = req.cookies.token;
        if(token){
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if(verified){
                const user1 = await db.Student.findById(verified.userId)
                .populate({path : "enrolledClasses requestedClasses", select : "-studentRequests"}).exec();

                const user2 = await db.Tutor.findById(verified.userId)
                .populate({path : "classes"}).exec();
                // console.log('current Student',user1);
                // console.log('current tutpr',user2);
                if(user1)
                return res.send(user1);
                return res.send(user2);
            }
            else{
                console.log('no logged in user found !');
                res.send(null);
            }
        }
        else{
            console.log('null');
            res.send(null);
        }
    }catch(error){
        console.log(error);
      res.send(null);
    }
});

router.post('/createNewUser' , async(req, res) =>{
    const {username, password} = req.body;
    const newUser = await db.User.create({
        username,
        password,
    });
    res.send(newUser);
});


//student's classrooms
router.get('/student/classrooms/:classroomid', async(req, res, next) => {
    try{
        const {classroomid} = req.params;
        console.log(classroomid);
 
        const classroom = await db.Classroom.findById(classroomid)
        .select("-studentRequests");
        // .populate({path : "studentRequests enrolledStudents", select : "-password"}).exec();
        if(!classroom){
            return next({
                message : 'could not find class !',
                status : false
            });
        }
        console.log(classroom);
        res.send(classroom);   

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});
//===========================classroom by ID => student
router.get('/student/classroom/:classroomid', async(req, res, next) => {
    try{
        const {classroomid} = req.params;
        console.log(classroomid);
 
        const classroom = await db.Classroom.findById(classroomid)
        .populate({path : "enrolledStudents assignments", select : "-doneby"}).exec();
        console.log('daata from backend=>',classroom);
        if(!classroom){
            return next({
                message : 'could not find class !',
                status : false
            });
        }
        console.log(classroom);
        res.send(classroom);   

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});


//=========================== Assignment by ID 
router.get('/assignment/:AID/get', async(req, res, next) => {
    try{
        const {AID} = req.params;
        console.log(AID);
 
        const assignment = await db.Assignment.findById(AID)
        .populate({path : "doneby", populate : { path : "student", select : "name email phone"}}).exec();


        if(!assignment){
            return next({
                message : 'could not find Assignment !',
                status : false
            });
        }
        console.log('daata from backend=>',assignment);
        res.send(assignment);  

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});

//===========================classroom by ID => tutor
router.get('/classroom/:classroomid', async(req, res, next) => {
    try{
        const {classroomid} = req.params;
        console.log(classroomid);
 
        const classroom = await db.Classroom.findById(classroomid)
        .populate({path : "studentRequests enrolledStudents assignments", select : "-password", populate : {path : "doneby", populate : {path : "student"}}}).exec();
        if(!classroom){
            return next({
                message : 'could not find class !',
                status : false
            });
        }
        console.log(classroom);
        res.send(classroom);   

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});

//===========================all classrooms of a tutor
router.get('/:tutorid/classrooms', async(req, res, next) => {
    try{
        const tutorid = req.params.tutorid;
 
        const tutor = await db.Tutor.findById(tutorid)
        .populate({path : "classes"}).exec();
        if(!tutor){
            return next({
                message : 'could not find tutor',
                status : false
            });
        }
        const classrooms = tutor.classes;
        res.send(classrooms);   

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }
});


//=====================================create a new classroom
router.post('/:tutorid/classroom/new', async(req, res, next) => {
    try{
console.log('in create classroom route');
       const tutorid = req.params.tutorid;
       const {className, subject, description} = req.body;

       const tutor = await db.Tutor.findById(tutorid);
       if(!tutor){
           return next({
               message : 'could not find tutor',
               status : false
           });
       }
       
       const generateUniqueId = require('generate-unique-id'); 
        let classroomID = generateUniqueId({
            length: 9,
            useLetters : false
           });

       const newClassroom = await db.Classroom.create({
           className, subject, creator : tutorid,classroomID, description
       })

       tutor.classes.push(newClassroom._id);
       await tutor.save();

       console.log(newClassroom);
       return next({
           message : 'classroom created successfully',
           status : true
       });      

    }catch(err){
        console.log(err);
       return next({
           message : err.message,
           status : false
       });
    }

});

//============================= send request to join a classroom
router.post('/:SID/joinclassroom/:CID', async(req, res, next)=>{
    try{
        console.log('called');
        const {SID, CID}=  req.params;
        console.log(SID,CID);
        const student = await db.Student.findById(SID);
        console.log('sender=>',student.name);
        const classroom = await db.Classroom.findOne({classroomID : CID.toString()});

        if(!classroom)
        return next({
            message: `No classroom with found with id ${CID}`,
            status : false
    });

        if (student.requestedClasses.length > 0) {
            let isexist = student.requestedClasses.filter(request => request.toString() === classroom._id.toString());
            if (isexist.length > 0) {
                return next({
                            message: "Your request is still pending "
                    });
            }
        }

        console.log('classroom=>',classroom);

        // const tutor = await db.Tutor.findById(classroom.creator);
        student.requestedClasses.push(classroom._id);
        classroom.studentRequests.push(SID);
        await student.save();
        await classroom.save();
        console.log('request sent successfully');
        return next({
            message : "request sent successfully !",
            status : true
        });

    }catch(err){
        console.log(err);
        return next({
            message : err.message,
            status : false
        });
    }

});


//=====================================================classroom ACCEPT request  
router.post('/:classroomID/requests/:requestID/accept', async(req, res, next) => {
    try{
        console.log('working on classroom request acceptance');

        //requestID = student's ID who sent request
        const {classroomID, requestID} = req.params;
        const classRoom = await db.Classroom.findById(classroomID);        
        if(classRoom.enrolledStudents.length > 0){
        const alreadyAccepted = classRoom.enrolledStudents.filter( joinedID => joinedID.toString() === requestID.toString());
        if(alreadyAccepted.length > 0){
            return next({
                message : 'student already in classroom !'
            });
        }
    }
        const student = await db.Student.findById(requestID);
        //remove request and add to joined student then add to students myClassrooms
        const updatedRequests = classRoom.studentRequests.filter(id => id.toString() !== requestID.toString());
        classRoom.studentRequests = updatedRequests; 
        classRoom.enrolledStudents.push(requestID);
        student.enrolledClasses.push(classroomID);
        await classRoom.save();
        //remove from student's myClassroomRequests
        const updatedClassroomsRequest = student.requestedClasses.filter( req => req.toString() !== classroomID.toString());
        student.requestedClasses = updatedClassroomsRequest;
        await student.save();

        console.log('classroom',classRoom);
        return next({
            message : "request accepted"
        });

    }catch(error){
        console.log(`catch error : ${error}`);
        return next({
            message : 'couldn\'t process request....please try after sometime'
        });
    }
});

//classroom REJECT request  
router.post('/:classroomID/requests/:requestID/reject', async(req, res, next) => {

    try{
        //requestID = student's ID who sent request
        const {classroomID, requestID} = req.params;
        const classRoom = await db.Classroom.findById(classroomID);        
        if(classRoom.enrolledStudents.length > 0){
        const requestExists = classRoom.enrolledStudents.filter( joinedID => joinedID.student.toString() === requestID.toString());
        if(requestExists.length === 0){
            return next({
                message : 'Request already rejected !'
            });
        }
    }

        const student = await db.Student.findById(requestID);
        //remove request from classroom, and student's requested classes
        const updatedRequests = classRoom.studentRequests.filter(id => id.toString() !== requestID.toString());
        classRoom.studentRequests = updatedRequests; 
        await classRoom.save();

        //remove from student's myClassroomRequests
        const updatedClassroomsRequest = student.requestedClasses.filter( req => req.toString() !== classroomID.toString());
        student.requestedClasses = updatedClassroomsRequest;
        await student.save();

        console.log('classroom',classRoom);
        return next({
            message : "request Rejected Successfully"
        });
    }catch(error){
        console.log(`catch error : ${error}`);
        return next({
            message : 'couldn\'t process request....please try after sometime'
        });
    }
});



//====================LOGIN=============
router.post('/login', async(req, res, next) => {
    try{
        const {as, email, password } = req.body;
        if(as === "student"){
            const user = await db.Student.findOne({email});
           if(user){
               console.log(user);
               const correctPassword = await bcrypt.compare(password, user.password);
               if(correctPassword){
                   console.log(bcrypt.compare(password, user.password));
                //jwt work
                const token = jwt.sign({
                    userId : user._id,
                 },
                 process.env.JWT_SECRET_KEY 
                 );
                 //send the token to browser cookie
                 console.log('logged in as '+user.name);
                 res.cookie( "token", token, {httpOnly : true}).send({
                    message : `logged in as ${user.name}`,
                    status : true
                });
}
               else return next({message : 'wrong password', status : false});
}
           else return next({message : 'wrong email', status : false});
        }else{
            const user = await db.Tutor.findOne({email});
            if(user){
                console.log(user);
                if(bcrypt.compare(password, user.password)){
                 //jwt work
                 const token = jwt.sign({
                     userId : user._id,
                  },
                  process.env.JWT_SECRET_KEY 
                  );
                  //send the token to browser cookie
                  console.log('logged in as '+user.name);
                  res.cookie( "token", token, {httpOnly : true}).send({
                      message : `logged in as ${user.name}`,
                      status : true
                  });
                }
                else return next({message : 'wrong password', status : false});
            }
            else return next({message : 'wrong email', status : false});            
        }    
    }
    catch(error){
        console.log('login error',error);
    }

});


//=====================SIGNUP===============
router.post('/signup', async(req, res, next) => {
    console.log('called');
    try{
        const {as, name, gender, email, phone, dob, password } = req.body;
        console.log('Body',req.body);

        if(as === "student"){
            const user1 = await db.Student.find({email});
            const user2 = await db.Student.find({phone});
            if(user1.length>0){
            return next({
                message : "email already regstered",
                status : false
            });
        }
        if(user2.length > 0 ){
            return next({
                message : "phone already regstered",
                status : false
            });
        }

        }
         else {

            const user1 = await db.Tutor.find({email});
            const user2 = await db.Tutor.find({phone});
            if(user1.length>0){
            return next({
                message : "email already regstered",
                status : false
            });
        }
        if(user2.length>0){
            return next({
                message : "phone already regstered",
                status : false
            });
        }

         }

         const userData = {
             ...req.body,
             role : as,
             password :  await bcrypt.hash(password, 10)
         }

         if(as === "student"){
             const newStudent = await db.Student.create(userData);
             console.log('newStudent',newStudent);
         }
         else {
            const newTutor = await db.Tutor.create(userData);
            console.log('newTutor',newTutor);
         }

        return next({
            message : "Registered successfully",
            status : true
        });
        
    }catch(error){
        console.log(error);
        return next({
            message : error.message,
            status  : false
        });
    }   
});


module.exports = router;