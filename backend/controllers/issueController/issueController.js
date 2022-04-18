const AWS = require('aws-sdk');
const uuid = require('uuid');
const awsCreds=require("../../config/credentials.json");


AWS.config.update({
        accessKeyId: awsCreds.AWS_ACCESS_KEY_ID,
        secretAccessKey: awsCreds.AWS_SECRET_ACCESS_KEY,
        sessionToken: awsCreds.AWS_SESSION_TOKEN,
        region: awsCreds.AWS_COGNITO_REGION,
});

var sns = new AWS.SNS();
const docClient = new AWS.DynamoDB.DocumentClient();
const tableOne = "user";


exports.createTopic = async (email) => {
    const userEmail=email;
    let topicArn="";
    sns.createTopic({Name: uuid.v4()}).promise().then(topicCreationRes=>{
        console.log(" Logssss"+topicCreationRes);
        topicArn=topicCreationRes.TopicArn;

        let dbParams={
            TableName: tableOne,
            Key: {
                "email": userEmail
            },
            UpdateExpression: 'set topicArn = :TopicArn',
            ExpressionAttributeValues: {
                ":TopicArn": topicArn,
            }
        };

         docClient.update(dbParams).promise().then(userRes => {
            this.subscribe({"email":userEmail,"topicArn":topicArn});
        }).catch(error=>{
            return { 
                "message": "unable to create topic",
                "error": error
             };
        });
    }).catch(err=>{
        console.log("Err in topic creation");
    });  
}

exports.subscribe = async (param) => {
    const subDetails={
        Protocol: 'EMAIL',
        TopicArn: param.topicArn,
        Endpoint: param.email
    };
    sns.subscribe(subDetails).promise().then((data) => {
        console.log("Subscription email sent");
    }).catch(err=>{
       console.log(JSON.stringify(err));
    });
}

exports.publishEmail = async (userEmail) => {
   
    const params = {
        TableName: tableOne,
        Key: {
            "email": userEmail.contactNo
        }
    };
  
    docClient.get(params).promise().then(async (userData) => {
        
        let emailParams={
            Message: userEmail.msg,
            Subject: userEmail.subject,
            TopicArn: userData.Item.topicArn
        };
        sns.publish(emailParams,(err, data) => {
            if (err) {
                return{
                    status: "500",
                    err: err
                }
            } else {
                return {
                    status: "200",
                    data: data
                }
            }
        });
       
    }).catch(error => {
        return { 
            "error":error
         };
    });

}

exports.publishText = async (snsDetails) => {

    let snsParam={
        Message: snsDetails.msg,
        Subject: snsDetails.subject,
        PhoneNumber: snsDetails.contactNo
    }

    sns.publish(snsParam).promise().then(snsResult=>{
        //console.log(" Res ponse SNS Text"+JSON.stringify(snsResult));
    }).catch(err=>{
        //console.log(JSON.stringify(err));
    });
};
