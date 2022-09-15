import api from "../services/api";

async function UploadFilesService(file, onUploadProgress) {
    return await api.post("/ncm", file, {
        headers: {
            "Content-Type": "application/octet-stream",
        },
        onUploadProgress,
    });
}

function useUploadService() {
    return { UploadFilesService };
}

export default useUploadService;