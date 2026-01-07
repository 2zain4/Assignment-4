const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const userFilePath = path.resolve(__dirname, 'users.json');

function readUsers() {
    try {
        const data = fs.readFileSync(userFilePath, 'utf-8');
       if(!data || data.trim() === '') {
            return [];
       }
       return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
}

function writeUsers(users){
    try{
        fs.writeFileSync(userFilePath,JSON.stringify(users,null,2));
    }catch(err){
        console.error("Error writing users file:", err);
    }
}


// app.get("/users",(req,res,next) => {
//     console.log("Fetching users");
// })


// ==============================
// q1
app.post("/user",(req,res,next) => {
    const {name,age,email} = req.body;

    const users = readUsers();

    const emailExists = users.find(user => user.email === email);
     if(emailExists){
        return res.status(409).json({error: "Email already exists"});
     }

     const newUSer = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name:name,
        email:email,
        age:age
     }

     users.push(newUSer);
     writeUsers(users)

     res.status(201).json({
        message: 'user creat successfully',
        user: newUSer
     })
})

// ===============================
// q2

app.patch("/user/:id",(req,res,next) => {
    const userId = parseInt(req.params.id);
    const {name,age,email} = req.body;
    const users = readUsers();

    const userIndex = users.findIndex(user => user.id === userId);

    if(userIndex === -1){
        return res.status(404).json({error: "User not found"});
    }
    if(email !== undefined){
        const emailExists = users.find(user => user.email === email && user.id !== userId);
      if(emailExists){
        return res.status(409).json({error: "Email already exists"});
      }
    }
    if(name !== undefined){
        users[userIndex].name = name;
    }
     if(age !== undefined){
        users[userIndex].age = age;
    }

     writeUsers(users)

     res.status(201).json({
        message: 'user updata successfully',
        user: users[userIndex]
     })

});

// ===============================
// q3

app.delete("/user{/:id}",(req,res,next) => {
    const userId = parseInt(req.params.id);
    const users = readUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1){
        return res.status(404).json({error: "User not found"});
    }

    users.splice(userIndex,1);
     writeUsers(users)

    res.status(201).json({message: "User deleted!"});
})

// ================================
// q4
app.get("/user/getByName",(req,res,next) => {

  const {name}= req.query;
  const users = readUsers();
    
    const getByName = users.find(user => user.name === name);
    if(!getByName){
        return res.status(404).json({error: "User not found"});
    }

    res.status(200).json({users: getByName});

})


// =================================
// q5

app.get("/user",(req,res,next) => {

  const users = readUsers();

    res.status(200).json({users: users});

})

// ================================
// q6
app.get("/user/filter",(req,res,next) => {

  const {minAge}= req.query;
  const users = readUsers();
    
   
    if(!minAge){
        return res.status(404).json({error: "minAge query parameter is required"});
    }

    const getminAge = users.filter(user => user.age >= minAge);
    if(!getminAge.length === 0){
        return res.status(404).json({error: "User not found"});
    }

    res.status(200).json({users: getminAge});

})



// =================================
// q7
app.get("/user/:id",(req,res,next) => {
    const {id} = req.params;
    const users = readUsers();

    const getById = users.find(user => user.id === parseInt(id));
    if(!getById){
        return res.status(404).json({error: "User not found"});
    }

       res.status(200).json({users: getById});
})









app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
})