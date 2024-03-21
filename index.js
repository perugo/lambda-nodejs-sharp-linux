const AWS = require('aws-sdk');
const sharp = require('sharp');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const bucket = event.Bucket;
  const img = event.img;
  const inputdir = event.inputdir;
  const outputdir = event.outputdir;

  // 以下に、イベントから取得した変数
  console.log(`Bucket: ${bucket}`);
  console.log(`Image: ${img}`);
  console.log(`Input Directory: ${inputdir}`);
  console.log(`Output Directory: ${outputdir}`);
  
  const params = {
    Bucket: bucket,
    Key:`${inputdir}${img}`
  };

  try {
    const image = await s3.getObject(params).promise();
    const resizedImage = await sharp(image.Body)
      .resize(200, 200) // 例: 200x200ピクセルにリサイズ
      .toFormat('jpeg')
      .toBuffer();

    await s3.putObject({
      Bucket: bucket,
      Key: `${outputdir}${key}`,
      Body: resizedImage,
      ContentType: 'image/jpeg',
    }).promise();

    return { status: 'success', message: 'Image resized and uploaded successfully' };
  } catch (err) {
    console.error(err);
    return err;
  }
  
};