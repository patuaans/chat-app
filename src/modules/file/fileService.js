const AWS = require('aws-sdk');
const { Message } = require('../../models/message');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const handleFileUpload = async (socket) => {
    socket.on('upload', async (file, username, callback) => {
        if (!file) {
            console.log('No file uploaded.');
            return;
        }
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${Date.now()}-${file.name}`,
            Body: file.data,
            ContentType: file.type,
            // ACL: 'public-read',
        };
        try {
            const s3Upload = await s3.upload(params).promise();
            const fileUrl = s3Upload.Location;
            const newMessage = new Message({
                username: username,
                message: 'File Uploaded',
                fileUrl: fileUrl,
            });
            await newMessage.save();
            global._io.emit('chat', newMessage);
            callback({ status: 'success' });
        } catch (error) {
            console.error('Error uploading to S3:', error);
            callback({ status: 'failure' });
        }
    });
};

module.exports = { handleFileUpload };