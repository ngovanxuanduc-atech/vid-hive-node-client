"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
class VidHiveClient {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }
    async getSignedUrl(filename, sameVpc) {
        const response = await axios_1.default.post(`${this.baseUrl}/api/v1/upload/sign-url`, { filename, sameVpc }, {
            headers: {
                'X-API-KEY': this.apiKey,
                'Content-Type': 'application/json',
            },
        });
        if (!response.data.signedUrl) {
            throw new Error('Signed URL is missing in the response.');
        }
        return response.data;
    }
    async uploadToSignedUrl(signedUrl, filePath) {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }
        const form = new form_data_1.default();
        form.append('file', fs_1.default.createReadStream(filePath));
        await axios_1.default.post(signedUrl, form, {
            headers: {
                ...form.getHeaders(),
            },
        });
    }
    async uploadFile(filename, filePath, sameVpc = true) {
        try {
            const { signedUrl, storageKey } = await this.getSignedUrl(filename, sameVpc);
            await this.uploadToSignedUrl(signedUrl, filePath);
            return storageKey;
        }
        catch (error) {
            console.error('Error occurred during file upload:', error.message);
            if (error.response && error.response.data) {
                console.error('Response body:', error.response.data);
                throw new Error(`File upload failed: ${error.message}. Response: ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`File upload failed: ${error.message}`);
        }
    }
}
exports.default = VidHiveClient;
