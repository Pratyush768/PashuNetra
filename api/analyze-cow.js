export const config = {
  api: {
    bodyParser: false, // because you are sending FormData
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Example: read uploaded file from FormData
      // In serverless, you may use `formidable` or `busboy` to parse multipart data
      // For demo, we just return success
      res.status(200).json({ success: true, message: "Cow analyzed successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
