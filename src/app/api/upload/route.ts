import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { promises as fsPromises } from 'fs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const fileData = await fsPromises.readFile('address.csv', 'utf-8');

    const s3 = new S3Client({
      region: "ap-south-1", // make sure the region is correct
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: 'csvbuckett', // your bucket name
      Key: 'address.csv', // file name in S3
      Body: fileData,
    };

    const uploadCommand = new PutObjectCommand(params);
    const uploadResult = await s3.send(uploadCommand);

    console.log('File uploaded successfully:', uploadResult);

    return NextResponse.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
