
var moment = require('moment');
const AWS = require("aws-sdk");
const awsCreds=require("../../config/credentials.json");

AWS.config.update({
    region: awsCreds.AWS_COGNITO_REGION,
    accessKeyId:awsCreds.AWS_ACCESS_KEY_ID,
    secretAccessKey:awsCreds.AWS_SECRET_ACCESS_KEY,
    sessionToken:awsCreds.AWS_SESSION_TOKEN
  });

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "user";


exports.getDonors=async(req,res)=>{
    const params = {
        TableName: table
    };
    
    docClient.scan(params).promise().then(async(donorListItems)=>{
        let prepareDonorListRes=[];
        let donorList= donorListItems.Items;
        console.log(JSON.stringify(donorListItems)+" DOnorlist");
        donorList.map(donor=>{
           if(donor){
               if(donor.lastDonatedOn){
                   var monthDiff = moment(moment().format("YYYY-MM-DD")).diff(moment(donor.lastDonatedOn,"YYYY-MM-DD"), 'months');
                   console.log("Hello timeDiff"+monthDiff);
                   if(monthDiff>2){
                       prepareDonorListRes.push(donor);
                   }
               }else{
                   prepareDonorListRes.push(donor);
               } 
           }
       });
       return res.status(200).send(prepareDonorListRes);
    }).catch(err=>{
        console.log(err+" dsfdsfsd");
        return res.status(400).json({"message":"Unable to fetch available donors"});
    }); 
};


exports.getDonorById=async(req,res)=>{
    
    const params = {
        TableName: table,
        Key:{
            "email": req.params.id
        }
    };

    docClient.get(params).promise().then(async(userList)=>{
        res.status(200).send(userList);
    }).catch(err=>{
        return res.status(400).json({"message":"Unable to fetch users"});
    });  
}

