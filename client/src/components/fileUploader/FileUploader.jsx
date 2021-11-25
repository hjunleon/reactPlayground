import "./FileUploader.scss";
import React, { useRef } from "react";



export default function FileUploader({
  onFileSelectError,
  onFileSelectSuccess,
  MBLimit = 1,
  inputName = "fileBlob"
}) {
  const fileInput = useRef(null);

  let byteLimit = MBLimit * 1024000;


    const sanitizeFileSize = (size) => {
        let suffix = "B"
        if (size >= 1000000000 ){
            suffix = "G" + suffix
            size /= 1000000000
        } else if (size >= 1000000 ){
            suffix = "M" + suffix
            size /= 1000000
        } else if (size >= 1000 ){
            suffix = "K" + suffix
            size /= 1000
        }
        return `${size.toString()} ${suffix}`
    }

  const handleFileInput = (e) => {
    // handle validations

    const file = e.target.files[0];
    const files = e.target.files;
    console.log(file);

    // let fileList = [];

    // for (let i = 0; i < files.length; i += 1) {
    //   let thisFile = files[i];
    //   if (thisFile.size > byteLimit) {
    //     onFileSelectError({
    //       error: `File size cannot exceed more than ${MBLimit}MB`,
    //     });
    //     return;
    //   } else fileList.push(thisFile);
    // }

    let fileList = {};

    for (let i = 0; i < files.length; i += 1) {
      let thisFile = files[i];
      if (thisFile.size > byteLimit) {
        onFileSelectError({
          error: `File size cannot exceed more than ${MBLimit}MB`,
        });
        return;
      } else {
          let newObj = {
                "fileName": thisFile.name,
                "size": sanitizeFileSize(thisFile.size)
          }
          fileList[thisFile.name] = newObj
      };
    }

    // onFileSelectSuccess(fileList);
    onFileSelectSuccess(prevState => {
        return {...prevState,...fileList}
    });
    // if (file.size > byteLimit)
    //   onFileSelectError({
    //     error: `File size cannot exceed more than ${MBLimit}MB`,
    //   });
    // else onFileSelectSuccess(file);
  };
  //multiple="multiple" for selecting multiple files
  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileInput} id={inputName} name={inputName} multiple="multiple"/>

      <button
        onClick={(e) => fileInput.current && fileInput.current.click()}
        className="btn btn-primary"
      />
    </div>
  );
}
