const uuid = require('uuid');
const AWS = require("aws-sdk");
const issueController = require("../issueController/issueController");
const awsCreds=require("../../config/credentials.json");

AWS.config.update({
    region: awsCreds.AWS_COGNITO_REGION,
    accessKeyId:awsCreds.AWS_ACCESS_KEY_ID,
    secretAccessKey:awsCreds.AWS_SECRET_ACCESS_KEY,
    sessionToken:awsCreds.AWS_SESSION_TOKEN
  });


const docClient = new AWS.DynamoDB.DocumentClient();
const table = "requests";
const tableOne="user";


exports.createRequests=async(req,res)=>{
    if(req.body){
        let newRequest= {
            requestId:uuid.v4(),
            requesterId:req.body.requesterId,
            requesterContactNo:req.body.requesterContactNo,
            donorId:req.body.donorId,
            donorContactNo:req.body.donorContactNo,
            action:"REQUESTED",
            preferredDate:req.body.preferredDate,
            bloodRequired:req.body.bloodRequired,
            requesterName:req.body.requesterName
        };

        const dbBody = {
           TableName:table,
           Item:newRequest
       };
        
        await docClient.put(dbBody).promise().then(async(dataS)=> {
           //console.log("Added item:", JSON.stringify(dataS));
           
           // uncomment it now
           await triggerAWSSNS(newRequest);
           return res.status(200).json({msg:newRequest});
       }).catch(putErr=>{
           console.log(JSON.stringify(putErr)+"errrr innnn");
           return res.status(400).json({"message":"Unable to create requests. System error. Please Try after sometime"});
       });
    }else{
       return res.status(400).json({"message":"Unable to create request. Request Body required"});
    }
 }


// list of requests raised by the requester
exports.getAllRequestsByRequester=async(req,res)=>{

    const params = {
        TableName: table
    };

    const requesterId=req.params.requesterId;

    docClient.scan(params).promise().then(async(requestsList)=>{
        console.log(JSON.stringify(requestsList)+" Request list");
        const reqList=requestsList.Items;
        const prepareRequesterRequests=[];
        reqList.map(requestsL=>{
            if(requestsL.requesterId==requesterId){
                prepareRequesterRequests.push(requestsL);
            }
        });
        return res.status(200).send(prepareRequesterRequests);
    }).catch(err=>{
        console.log("Err"+ err);
        return res.status(400).json({"message":"Unable to fetch requests"});
    });   
 };


 exports.getRequestByID=async(req,res)=>{
    const params = {
        TableName: table,
        Key:{
            "requestId": req.params.requestId
        }
    };

    docClient.get(params).promise().then(async(requestList)=>{
        res.status(200).send(requestList);
    }).catch(err=>{
        return res.status(400).json({"message":"Unable to fetch users"});
    });   
 };


 exports.getAllRequests=async(req,res)=>{
    const params = {
        TableName: table
    };

    docClient.scan(params).promise().then(async(requests)=>{
        res.status(200).send(requests);
    }).catch(err=>{
        return res.status(400).json({"message":"Unable to fetch users"});
    });   
 };

 // this method returns the request requested for the donor
 exports.getAllRequestsForDonor=async(req,res)=>{
    const params = {
        TableName: table
    };

    const donorId=req.params.donorId;

    docClient.scan(params).promise().then(async(requestsList)=>{
        console.log(JSON.stringify(requestsList)+" Request list");
        const reqList=requestsList.Items;
        const prepareDonorRequests=[];
        reqList.map(requestsL=>{
            if(requestsL.donorId==donorId && requestsL.action=='REQUESTED' ){  // 
                prepareDonorRequests.push(requestsL);
            }
        });
        res.status(200).send(prepareDonorRequests);
    }).catch(err=>{
        console.log("Err"+ err);
        return res.status(400).json({"message":"Unable to fetch users"});
    });    
 };


 exports.updateRequestStatus=async(req,res)=>{
    if(req.body){
        
        let updatebdy=req.body;
        console.log("LOg Update ID"+updatebdy.requestId);
        let updateExpression='SET';
        let ExpressionAttributeNames={};
        let ExpressionAttributeValues = {};

        for (const prop in updatebdy) {
            if(prop!="requestId"){
                updateExpression += ` #${prop} = :${prop} ,`;
                ExpressionAttributeNames['#'+prop] = prop ;
                ExpressionAttributeValues[':'+prop]=updatebdy[prop];
            }  
        }

        updateExpression= updateExpression.slice(0, -1);

        const reqParams = {
            TableName: table,
            Key: {
                requestId: updatebdy.requestId
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: ExpressionAttributeNames,
            ExpressionAttributeValues: ExpressionAttributeValues
        };

        
       await docClient.update(reqParams).promise().then(async(dataU)=> {
            if(updatebdy.action=='APPROVED'){
                let msgBdy={
                    "msg":"Your request has been approved by "+ updatebdy.donorId,
                    "subject":"Request Approved"
                }

                await triggerAWSSNSForRequester(updatebdy,msgBdy);

                let userUpdateParams={
                    TableName: tableOne,
                    Key: {
                        "email": updatebdy.donorId
                    },
                    UpdateExpression: 'SET lastDonatedOn = :LastDonatedOn',
                    ExpressionAttributeValues: {
                        ":LastDonatedOn": updatebdy.preferredDate,
                    }
                };
    
                await docClient.update(userUpdateParams).promise().then((userUpdate)=> {
                    console.log(JSON.stringify(userUpdate)+"   jjjjj");
                    return res.status(200).json({msg:updatebdy});
                }).catch(err=>{
                    console.log("err "+JSON.stringify(err));
                    return res.status(400).json({"message":"Unable to update user. Please Try after sometime"});
                });
            }else{
                let msgBdy={
                    "msg":"Your request has been rejected by "+ updatebdy.donorId,
                    "subject":"Request Rejected"
                }
                await triggerAWSSNSForRequester(updatebdy,msgBdy);
                return res.status(200).json({msg:updatebdy});
            }
        }).catch(updateErr=>{
            return res.status(400).json({"message":"Unable to change status. System error. Please Try after sometime"});
        }); 
    }  
 }

 function triggerAWSSNSForRequester(param,msgBdy){
    let snsRequesterDetails={
        "msg":msgBdy.msg,
        "subject": msgBdy.subject,
        "contactNo": param.requesterContactNo
       };

       let emailRequesterDetails={
        "msg":msgBdy.msg,
        "subject": msgBdy.subject,
        "contactNo": param.requesterId
       };

       issueController.publishText(snsRequesterDetails);
       issueController.publishEmail(emailRequesterDetails);
}

function triggerAWSSNS(param){
    console.log("JSON PARAM"+JSON.stringify(param));
    let snsRequesterDetails={
        "msg":"Your request has been forwarded to the donor.",
        "subject": "Request Sent",
        "contactNo": param.requesterContactNo
       };

       let snsDonorDetails={
        "msg":"A new request for blood. Please login to check requester details",
        "subject": "Need Blood",
        "contactNo": param.donorContactNo
       };

       let emailRequesterDetails={
        "msg":"Your request has been forwarded to the donor.",
        "subject": "Request Sent",
        "contactNo": param.requesterId
       };

       let emailDonorDetails={
        "msg":"A new request for blood. Please login to check requester details",
        "subject": "Need Blood",
        "contactNo": param.donorId
       };

       issueController.publishText(snsRequesterDetails);
       issueController.publishText(snsDonorDetails);

       issueController.publishEmail(emailRequesterDetails);
       issueController.publishEmail(emailDonorDetails);
}

