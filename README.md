# Vid-Hive Client

The `vid-hive-client` library provides a simple interface for uploading files to a server using an API key and form data.

## Installation

Install the library and its dependencies using npm:

```bash
npm install
```

## Usage

Here is an example of how to use the `vid-hive-client` library:

```typescript
import { uploadFile } from "./index";

const uploadUrl = "https://example.com/upload";
const apiKey = "your-api-key";
const filePath = "/path/to/your/file.mp4";

(async () => {
  try {
    const response = await uploadFile(uploadUrl, apiKey, filePath, {
      folder: "videos",
    });
    console.log("Upload successful:", response);
  } catch (error) {
    console.error("Upload failed:", error);
  }
})();
```

## API

### `uploadFile(uploadUrl: string, apiKey: string, filePath: string, additionalData?: Record<string, string>): Promise<any>`

Uploads a file to the specified URL using an API key for authentication.

- `uploadUrl`: The URL to upload the file to.
- `apiKey`: The API key for authentication.
- `filePath`: The path to the file to upload.
- `additionalData`: Optional additional form data to include in the upload.

Returns the response from the server.
