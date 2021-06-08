import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';

const ProgressBar = ({ file, setFile, setProfilePicUrl, pictureID }) => {
  var { progress, url } = useStorage(file, pictureID);


  useEffect(() => {
    if (url) {
      setFile(null);
      url = url.substring(0, url.indexOf("?")) + "?alt=media";
      setProfilePicUrl(url);
    }
  }, [url, setFile]);

  return (

    <div className="progress-bar-container">
      <div className="pic-progress-bar" style={{width: progress+"%"}}>

      </div>
    </div>
  );
} 

export default ProgressBar;