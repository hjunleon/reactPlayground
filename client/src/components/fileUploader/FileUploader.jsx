import React, { useRef } from "react";

export default function FileUploader({
  onFileSelectError,
  onFileSelectSuccess,
  MBLimit = 1,
}) {
  const fileInput = useRef(null);

  let byteLimit = MBLimit * 1024000;

  const handleFileInput = (e) => {
    // handle validations

    const file = e.target.files[0];
    const files = e.target.files;
    console.log(file);

    let fileList = [];

    for (let i = 0; i < files.length; i += 1) {
      let thisFile = files[i];
      if (thisFile.size > byteLimit) {
        onFileSelectError({
          error: `File size cannot exceed more than ${MBLimit}MB`,
        });
        return;
      } else fileList.push(thisFile);
    }
    onFileSelectSuccess(fileList);
    // if (file.size > byteLimit)
    //   onFileSelectError({
    //     error: `File size cannot exceed more than ${MBLimit}MB`,
    //   });
    // else onFileSelectSuccess(file);
  };
  //multiple="multiple" for selecting multiple files
  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileInput} name="fileField" multiple="multiple"/>

      <button
        onClick={(e) => fileInput.current && fileInput.current.click()}
        className="btn btn-primary"
      />
    </div>
  );
}
