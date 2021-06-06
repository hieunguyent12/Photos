import { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function StyledDropzone({ onDropFiles, uploadProgress, uploadStatus }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((files) => {
    setUploadedFiles((prev) => {
      return [...prev, ...files];
    });
    onDropFiles([...files, ...uploadedFiles]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: "image/*" });

  // when finished uploading, empty the uploadedFiles array
  const { isDone, pending } = uploadStatus;
  useEffect(() => {
    if (isDone && !pending) {
      setUploadedFiles([]);
    }
  }, [isDone, pending]);

  const files = uploadedFiles.map((file) => {
    // if the we are not uploading anything, just show the file name
    if (isEmpty(uploadProgress)) {
      return <p key={file.path}>{file.path}</p>;
    }
    // otherwise, show the upload progress next to the file name
    return (
      <div key={file.path}>
        <p key={file.path}>{file.path}</p>
        <p>{uploadProgress[file.name]}%</p>
      </div>
    );
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className="w-72 my-2">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {!isDragActive && uploadedFiles.length === 0 && (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        {isDragActive && <p>Drop the files here...</p>}
        {uploadedFiles.length > 0 && !isDragActive && files}
      </div>
    </div>
  );
}

export default StyledDropzone;
