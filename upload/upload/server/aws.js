require("dotenv").config();
// const {  S3 } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3")
const { AWS_ACCESS_KEY, AWS_SECRET_KEY} = process.env;

const s3 = new S3Client({
	region: "ap-northeast-2",
	// credentials: {
		secretAccessKey: AWS_ACCESS_KEY,
		accessKeyId: AWS_SECRET_KEY,
	// }
})

module.exports = { s3 };