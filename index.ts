import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

class VidHiveClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    private async getSignedUrl(filename: string, sameVpc: boolean): Promise<{ signedUrl: string; storageKey: string }> {
        const response = await axios.post(
            `${this.baseUrl}/api/v1/upload/sign-url`,
            { filename, sameVpc },
            {
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.data.signedUrl) {
            throw new Error('Signed URL is missing in the response.');
        }

        return response.data;
    }

    private async uploadToSignedUrl(signedUrl: string, filePath: string): Promise<void> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        await axios.post(signedUrl, form, {
            headers: {
                ...form.getHeaders(),
            },
        });
    }

    async uploadFile(filename: string, filePath: string, sameVpc: boolean = true): Promise<string> {
        try {
            const { signedUrl, storageKey } = await this.getSignedUrl(filename, sameVpc);
            await this.uploadToSignedUrl(signedUrl, filePath);
            return storageKey;
        } catch (error: any) {
            console.error('Error occurred during file upload:', error.message);
            if (error.response && error.response.data) {
                console.error('Response body:', error.response.data);
                throw new Error(
                    `File upload failed: ${error.message}. Response: ${JSON.stringify(
                        error.response.data
                    )}`
                );
            }
            throw new Error(`File upload failed: ${error.message}`);
        }
    }
}

export default VidHiveClient;