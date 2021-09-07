import http from "../http-common";

const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("https://localhost:5001/api/fileupload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};
const getFiles = () => {
    return http.get("https://localhost:5001/api/fileupload");
  };
  
  const FileUploadService = {
    upload,
    getFiles,
  };
  
  export default FileUploadService;
