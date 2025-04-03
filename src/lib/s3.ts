import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
    try {
        // Ensure env variables exist
        if (!process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || !process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
            throw new Error("Missing required S3 environment variables");
        }

        // Configure AWS SDK
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
            region: "us-east-1",
        });

        // Create S3 instance
        const s3 = new AWS.S3();

        // Generate unique file key
        const file_key = `uploads/${Date.now().toString()}-${file.name.replace(/ /g, "-")}`;

        // Define upload parameters
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
            ContentType: file.type // Ensure correct content type
        };

        // Upload file with progress tracking
        const upload = s3.putObject(params).on("httpUploadProgress", (evt) => {
            if (evt.total) {
                console.log("Uploading to S3.....", Math.round((evt.loaded * 100) / evt.total) + "%");
            }
        }).promise();

        // Wait for upload to complete
        await upload;

        console.log("Successfully uploaded to S3:", file_key);
        
        return {
            file_key,
            file_name: file.name,
        };
    } catch (error) {
        console.error("Failed to upload file to S3:", error);
        throw error;
    }
}

// Get public S3 file URL
export function getS3Url(file_key: string) {
    if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
        throw new Error("Missing S3 bucket name in environment variables");
    }

    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${file_key}`;
}
