import "./Web3Storage.scss";
import Topbar from "../../components/topbar/Topbar";
import SearchBar from "../../components/searchBar/SearchBar";

import { useEffect, useState } from "react";
import axios from "axios";

import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

// const web3FileStorageToken = process.env.WEB3_STORAGE_API_TOKEN;
// Construct with token and endpoint
// const client = new Web3Storage({ token: web3FileStorageToken });

export default function Storage() {
  const [formInput, setFormInput] = useState({
    fileName: "",
    fileBlob: null,
  });

  function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.WEB3_STORAGE_API_TOKEN;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  function getFiles(inputFieldElem) {
    // const fileInput = document.querySelector('input[type="file"]')
    return inputFieldElem.files;
  }

  const storeFiles = async (files) => {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log("stored files with cid:", cid);
    return cid;
  };

  async function storeWithProgress(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      console.log("uploading files with cid:", cid);
    };

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    let uploaded = 0;

    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk });
  }

  const handleChange = (e) => {
    console.log(e.target);
    let field = e.target.name;
    let data = e.target.value;
    if (field == "fileBlob") {
      data = getFiles(e.target);
    }
    console.log(data);
    // setFormInput((obj) => ({
    //   formInputs: {
    //     ...obj.formInputs,
    //     [field]:data
    //   },
    // }));
    console.log({ ...formInput });
    // console.log()
    let finalState = {
      ...formInput,
      [field]: data,
    };
    console.log(finalState);
    setFormInput(prevState => ({
        ...prevState,
        [field]: data
    }));
  };

  const handleSubmit = (e) => {
    console.log(e);
  };

  return (
    <div>
      <Topbar />
      <div className="standardFormWrap">
        <div className="standardForm">
          <label>
            Upload file here:
            <input
              type="file"
              name="fileBlob"
              value=""
              onChange={handleChange}
            />
          </label>
          <label for="fileName">
            File Name:
            <input
              type="text"
              name="fileName"
              value={formInput.fileName}
              onChange={handleChange}
            />
          </label>
          <div className="web3Btn" onClick={handleSubmit}>
            Upload
          </div>
        </div>
      </div>
    </div>
  );
}
