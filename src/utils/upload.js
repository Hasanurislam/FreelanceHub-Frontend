import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "skill_hub"); //   unsigned upload preset name

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dupr6lxok/image/upload", 
      data
    );
    const { secure_url } = res.data; 
    return secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err.response?.data || err.message || err);
    return null;
  }
};

export default upload;
