const express = require('express'); 

const router = express.Router();    //Importing Express Router

const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'dfhuebfjdws$56';     //string se we sign our token

//Router 1: Create a User using: Post "/api/auth/createuser". no login required
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
     body('password', 'Password must be atleast 5 characters ').isLength({ min: 5 }),
], async(req,res)=>{
   
    let success = false

    // create a user and use the save function as shown below. The save() function is used to save the document data into the database

    // const user = User(req.body);  
    // user.save()

     //if errors then return bad req and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check whether the user with same email exists already
    try{

      let user=await User.findOne({email: req.body.email});
      if(user){
        return res.status(400).json({success, email: "Sorry a user with this email already exists"});
        
      }
      const salt =await  bcrypt.genSalt(10);
      const secPass =await bcrypt.hash(req.body.password , salt) ;   //convert passsword into hash code

      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      })
      
      // .then(user => res.json(user)).catch(err=>{console.log(err),
      // res.json({error: 'Please enter a unique value' , message: err.message})});
      
      // res.send(req.body);      // req.send()-->It is used to Send a string response in a different format like XML,plaintext, etc. For example, we can send Hello, plain text, using res.send to /api/auth endpoint.
      // req.body--> It holds parameters that are sent up by the client as a part of the Post request. By default, its value is set to be undefined and hence it is populated with the help of middleware.
     const data ={
      user:{
        id: user.id
      }
     }
      const authtoken = jwt.sign(data, JWT_SECRET);           //sends a token
           success=true;        
      // res.json(user)
      res.json({success,authtoken})

      } catch (error){
        console.log(error.message);
        res.status(500).send("Internal server error");
      }
})

//Router 2: Authentication using: Post "/api/auth/login". no login required
router.post('/login',[
  
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blanked').exists()
  
], async(req,res)=>{
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email, password} = req.body;
  try {
    let user =await User.findOne({email});
    if(!user){
      success = false
      return res.status(400).json({error: "Please try to login with correct credentials"})
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      success = false
      return res.status(400).json({success,error: "Please try to login with correct credentials"})

    }
    const data ={
      user:{                        //If both credentials are correct,then send the payload
        
        id: user.id
      }
     }
      const authtoken = jwt.sign(data, JWT_SECRET);           //sends auth token as response
      success = true;
      res.json({success,authtoken}); 

  } catch (error){
        console.log(error.message);
        res.status(500).send("Internal server error");
      }
})

//Router 3:  Get loggedin user details using: Post "/api/auth/getuser" . login required
    //In our case, middleware--> is a function that will be called whenever a request will be made in the 'login required' routes.
router.post('/getuser',fetchuser, async(req,res)=>{
  try {
    userId =req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  }  catch (error){
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
})
module.exports= router