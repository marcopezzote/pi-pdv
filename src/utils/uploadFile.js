const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { client, bucketName } = require("../supabaseClient");

async function uploadFile(file) {
  const params = {
    Bucket: bucketName,
    Key: `images/${Date.now()}_${file.name}`,
    Body: file.data,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await client.send(command);
    console.log(`File uploaded successfully. ${data.Location}`);
    return `https://${
      process.env.SUPABASE_URL.split("//")[1]
    }/storage/v1/object/public/${bucketName}/${params.Key}`; // Construindo a URL pública
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    throw error;
  }
}

module.exports = { uploadFile };
