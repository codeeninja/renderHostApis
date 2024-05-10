const express=require('express');
const mysql=require('mysql');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
const jwt=require('jsonwebtoken');
const key='vbxckjvfvdfiugekj8943fbhbdv98fh348f3ef8ehndfuig4renf438hcn4398fh349hr4n589ghun9vbeefuig3b8f4378';
const bcrypt=require('bcrypt');

const con=mysql.createConnection({
    host:'localhost',
    database:"mydb",
    user:'root',
    password:''
});
con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Connection SuccessFull");
    }
});

app.get('/',(req,resp)=>{
    const sqlSel='select *from employees';
    con.query(sqlSel,(error,result)=>{
        if(error){
            console.log(error);
        }else{
            console.log(result)
            resp.send(result);
        }
    });
});

app.post('/',(req,resp)=>{
    const {emp_id,emp_name,dept_id,salary }=req.body;  
    const que="insert into employees (emp_id, emp_name, dept_id, salary) VALUES ( ?,?, ?, ?)";
     con.query(que,[emp_id,emp_name,dept_id,salary],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            resp.send("Employee Data Inserted Successfully");
        }
     }); 
});

app.put('/',(req,resp)=>{
    const {emp_name,dept_id,salary,emp_id }=req.body;  
    const que="update employees set emp_name=?,dept_id=?,salary=? where emp_id=?";
    con.query(que,[emp_name,dept_id,salary,emp_id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            //resp.send("Data Updated SuccessFully");
            resp.send(result);
        }
    });
});

app.delete('/',(req,resp)=>{
    const {emp_id}=req.body;
    const queryDel='delete from employees where emp_id=?';
    con.query(queryDel,emp_id,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            resp.send(result);
        }
    })
});

app.post('/registerUser',async (req,resp)=>{
    const {username,password}=req.body;
    const hashPassword=await bcrypt.hash(password,10);
    console.log(hashPassword);
    const selQue="select * from userLogin where loginId=?"
    const insertQue="insert into userLogin (loginID,userPassword) values(?,?)";
    con.query(selQue,username,(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        else if(result.length>0){
            resp.send("User Already Register");
        }
        else{
            con.query(insertQue,[username,hashPassword],(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    resp.send(result);
                }
            })
        }
    });
});

app.post("/userLogin", (req,resp)=>{
    const {username,password}=req.body;
    try{
        const selQue="select userPassword from userLogin where loginId=?";
        con.query(selQue,[username],async (err,result)=>{
            if(err){
                console.log(err)
            }else if(result.length===0){
                resp.send("No User Found With Login Id:-"+username);
            }else{
                const hashPassword=result[0].userPassword;
                const isMatch=await bcrypt.compare(password,hashPassword);
                if(isMatch){
                    resp.send("Password Match");
                }else{
                    resp.send("Password Wrong Password");
                }
            }
        });
    }catch(err){
        console.log(err);
    }
})
app.listen(5000);