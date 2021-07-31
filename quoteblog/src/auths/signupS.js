import {useState } from 'react'
import axios from 'axios'
import { Button,Row, ToggleButtonGroup, ToggleButton} from 'react-bootstrap'

import { useHistory } from 'react-router';

export default function SignupStudent({match}) {
 
  const [info, setInfo] = useState({
    class : '',
    board : '',
    stream : '',
  });
  const hist = useHistory();

  function changeStudentForm(val, e){
    const {name, value} = e.target;
    setInfo( prev => { return{...prev, [name] : value}});
  }

  async function handleS(e){
    e.preventDefault();
    if(info.class && info.board && info.stream){
      const {data} = await axios.post('http://localhost:5000/studentdetails/'+match.params.id, info);
      alert(data);
      hist.push('/dashs');
    }
    else{
      alert('select all options !');
    }
    console.log(info);
  }  

const classes1 = ['12', '11', '10', '9'];
const classes2 = ['8', '7', '6' ,'5'];
const classes3 = ['4', '3','2','1'];
const boards = ['ICSE' , 'CBSE', 'State'];
const streams = ['PCM', 'PCB', 'Com.', 'Arts'];

const classArr1 = classes1.map(c => 
          <ToggleButton id="tbg-radio" value={c} style={{background : "#EC7B12", margin : "0 10px 10px 0", borderRadius : "20px", width : "100px"}}>
            {c}
         </ToggleButton>  
);

const classArr2 = classes2.map(c => 
  <ToggleButton id="tbg-radio" value={c} style={{background : "#EC7B12", margin : "0 10px 10px 0", borderRadius : "20px", width : "100px"}}>
    {c}
 </ToggleButton>  
);

const classArr3 = classes3.map(c => 
  <ToggleButton id="tbg-radio" value={c} style={{background : "#EC7B12", margin : "0 10px 10px 0", borderRadius : "20px", width : "100px"}}>
    {c}
 </ToggleButton>  
);

const boardArr = boards.map(c => 
  <ToggleButton id="tbg-radio" value={c} style={{background : "#EC7B12",  margin : "0 10px 10px 0", borderRadius : "20px"}}>
  {c}
    </ToggleButton>
);

const streamArr = streams.map(c => 
  <ToggleButton id="tbg-radio" value={c} style={{background : "#EC7B12",  margin : "0 10px 10px 0", borderRadius : "20px"}}>
  {c}
 </ToggleButton>
);

  return (

    <div id="signupsPage">
<p style={{ color: "#E9922D"}}>Select Your Class</p>

<ToggleButtonGroup type="radio" name="class" value={info.class} onChange ={changeStudentForm} style={{width : "100%"}} required>
        {classArr1}
</ToggleButtonGroup>

<br/>

<ToggleButtonGroup type="radio" name="class" value={info.class} onChange ={changeStudentForm} style={{width : "100%"}} required>
        {classArr2}
</ToggleButtonGroup>
<br/>

<ToggleButtonGroup type="radio" name="class" value={info.class} onChange ={changeStudentForm} style={{width : "100%"}} required>
        {classArr3}
</ToggleButtonGroup>

  <p style={{ color: "#E9922D"}}>Select Your Board</p>

  <ToggleButtonGroup  type="radio" name="board" value={info.board} onChange ={changeStudentForm} style={{width : "75%"}} required>
    {boardArr}
  </ToggleButtonGroup>


  <p style={{ color: "#E9922D"}}>Select Your Stream</p>
  <ToggleButtonGroup type="radio" name="stream" value={info.stream} onChange ={changeStudentForm} style={{width : "75%"}} required>
{streamArr}

  </ToggleButtonGroup>
<br/>
<br/>
  <Button
  style={{border : "1px solid #5ef2b4",background : "#5ef2b4" ,color : "black",borderRadius : "24px"}}
  onClick={handleS} >Submit </Button>

</div>
  );
}