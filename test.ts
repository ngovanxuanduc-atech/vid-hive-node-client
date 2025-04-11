import VidHiveClient from './index';

const apiKey = 'duck_api_key';
const baseUrl = 'http://localhost:3210';
const filename = 'test-file.txt';
const filePath = './tsconfig.json'; // Replace with the actual file path

(async () => {
    const client = new VidHiveClient(apiKey, baseUrl);

    try {
        const response = await client.uploadFile(filename, filePath);
        console.log('Upload successful:', response);
    } catch (error) {
        console.error('Upload failed:', error);
    }
})();