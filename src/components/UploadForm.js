import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

const UploadForm = ({ setProfilePicUrl }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ['image/png', 'image/jpeg'];

  const handleChange = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please select an image file (png or jpg)');
    }
  };

  return (
    <form>
      <label className="file-upload-container">
        <div className="file-upload" >Upload File<br/>(optional)</div>
        <input type="file" className="file-upload input-hide" onChange={handleChange} />
      </label>
      <div className="output">
        { error && <div className="error">{ error }</div>}
        {/* { file && <div>{ file.name }</div> } */}
        { file && <ProgressBar file={file} setFile={setFile} setProfilePicUrl={setProfilePicUrl} /> }
      </div>
    </form>
  );
}

export default UploadForm;