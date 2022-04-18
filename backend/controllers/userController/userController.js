// const userSchema= require("../../models/UserModel");
const uuid = require('uuid');
const AWS = require("aws-sdk");
const awsCreds=require("../../config/credentials.json");
const issueController = require("../issueController/issueController");


AWS.config.update({
  region: awsCreds.AWS_COGNITO_REGION,
  accessKeyId:awsCreds.AWS_ACCESS_KEY_ID,
  secretAccessKey:awsCreds.AWS_SECRET_ACCESS_KEY,
  sessionToken:awsCreds.AWS_SESSION_TOKEN
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "user";



exports.createUser=async(req,res)=>{

    if(req.body){
        let newUser= {
            id: uuid.v4(),
            name:req.body.name,
            email:req.body.email,
            bloodGroup:req.body.bloodGroup,
            zipcode:req.body.zipcode,
            age:req.body.age,
            gender:req.body.gender || '',
            lastDonatedOn:req.body.lastDonatedOn || null,
            phone_number:req.body.phone_number
        };

        const dbBody = {
            TableName:table,
            Item:newUser
        };
        

        const findParams = {
            TableName: table,
            Key:{
                "email": newUser.email
            }
        };
        
        if(newUser.age<18){
            return res.status(400).json({email:"You are below 18. Not eligible to register in the application. Please contact help support. "});
        }else{
            docClient.get(findParams).promise().then(async(data)=>{
                if(Object.keys(data).length !== 0){
                    console.log(JSON.stringify(data)+" post finding the get ");
                    return res.status(400).json({email:"User with same email id already exists"});
                }else{
                    console.log("I am not present");
                    
                        await docClient.put(dbBody).promise().then(async(dataS)=> {
                            console.log("Added item:", JSON.stringify(dataS, null, 2));
                            // Uncomment it later
                           await issueController.createTopic(newUser.email); // to create topic for SNS at registration of user
                            return res.status(200).json({msg:newUser});
                        }).catch(putErr=>{
                            console.log(JSON.stringify(putErr));
                            return res.status(400).json({"message":"Unable to create user. System error. Please Try after sometime"});
                        });
                    //}
                }
            }).catch((err)=>{
                console.log(err);
                //return res.status(400).send("Unable to create user. System error. Please Try after sometime");
            });
        } 
    }
    
};


exports.getUsers=async(req,res)=>{
    const params = {
        TableName: table
    };
    
    docClient.scan(params).promise().then(async(userList)=>{
        res.status(200).send(userList);
    }).catch(err=>{
        return res.status(400).json({"message":"Unable to fetch users"});
    });  
}

exports.getUserById=async(req,res)=>{
    
    const params = {
        TableName: table,
        Key:{
            "email": req.params.id
        }
    };

    docClient.get(params).promise().then(async(userList)=>{
        res.status(200).send(userList);
    }).catch(err=>{
        console.log(err,"   errrr");
        return res.status(400).json({"message":"Unable to fetch users"});
    });  
}

exports.updateUser=async(req,res)=>{
    if(req.body){
        
        let updatebdy=req.body;

        let updateExpression='SET';
        let ExpressionAttributeNames={};
        let ExpressionAttributeValues = {};

        for (const prop in updatebdy) {
            if(prop!="email"){
                updateExpression += ` #${prop} = :${prop} ,`;
                ExpressionAttributeNames['#'+prop] = prop ;
                ExpressionAttributeValues[':'+prop]=updatebdy[prop];
            }  
        }

        updateExpression= updateExpression.slice(0, -1);

        const params = {
            TableName: table,
            Key: {
            email: updatebdy.email,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: ExpressionAttributeNames,
            ExpressionAttributeValues: ExpressionAttributeValues
        };

        console.log("LOGIN USER"+ JSON.stringify(params) );
        
        docClient.update(params).promise().then((dataU)=> {
            console.log("updated item:", JSON.stringify(dataU, null, 2));
            return res.status(200).json({msg:updatebdy});
        }).catch(updateErr=>{
            console.log(JSON.stringify(updateErr));
            return res.status(400).json({"message":"Unable to create user. System error. Please Try after sometime"});
        }); 
    }
    
};










/* exports.createUser=async(req,res)=>{

    if(req.body){
        let newUser= new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            bloodGroup:req.body.bloodGroup,
            zipcode:req.body.zipcode,
            age:req.body.age,
            gender:req.body.gender,
            lastDonatedOn:req.body.lastDonatedOn || null
        });
        
        User.findOne({email:newUser.email}).then(async(user)=>{
            try {
                if(user){
                    return res.status(400).json({email:"User with same email id already exists"});
                }else if(newUser.age<18 ){
                    return res.status(400).json({email:"You are below 18. Not eligible to register in the application. Please contact help support. "});
                }else{
                    await newUser.save();
                    return res.status(200).json({msg:newUser});
                }
              } catch (error) {
                if (error.name === "ValidationError") {
                  let errors = {};
            
                  Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                  });
            
                  return res.status(400).send(errors);
                }
                res.status(500).send("Something went wrong");
              }
            
        }).catch(err=>{
            console.log("Please provide all the details");
            return res.status(400).json({email:"Please provide all the details"});
        });
    }
    
}; */