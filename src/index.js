const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AWS = require("aws-sdk");
const tableName = process.env.DYNAMODB_TABLE_NAME;
const bucketName = process.env.AWS_BUCKET_NAME;
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uploadFileMiddleware = require('./middleware/fileUpload');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(cookieParser());
routes(app);
app.get("/", async(req,res) =>{
    try{
        const params = {
            TableName: tableName
        };
        const data = await dynamodb.scan(params).promise(); 
        console.log("data =",data.Items);
        return res.json(data.Items); // Dùng res để render  truyền biến data
    }catch(error){
        console.error("Error retrieving data from DDB",error);
        return res.status(500).send("Internal Server Error");
    }
});
app.post("/save", uploadFileMiddleware.single("image"), async (req, res) => {
    try {
        const image = req.file;
        if (!image) {
            return res.status(400).send("No image uploaded.");
        }
        const fileType = image.originalname.split(".").pop();
        const filePath = `${Date.now()}.${fileType}`;
        const paramsS3 = {
            Bucket: bucketName,
            Key: filePath,
            Body: image.buffer,
            ContentType: image.mimetype,
        };

        s3.upload(paramsS3, async (err, data) => {
            if (err) {
                console.error("Error uploading to S3: ", err);
                return res.status(500).send("Internal server error!");
            } else {
                const imageURL = data.Location;

                const paramsDDB = {
                    TableName: tableName,
                    Item: {
                        image: imageURL,
                    },
                };

                await dynamodb.put(paramsDDB).promise();
                return res.redirect("/");
            }
        });
    } catch (error) {
        console.error("Error saving data to DynamoDB: ", error);
        return res.status(500).send("Internal Server Error");
    }
});
mongoose
    .connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('ket noi db thanh cong');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(port, () => {
    console.log('port: ', +port);
});
