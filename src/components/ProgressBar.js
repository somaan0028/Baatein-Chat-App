import React, { useEffect, useState } from 'react';
import useStorage from '../hooks/useStorage';
import { motion } from 'framer-motion';

const ProgressBar = ({ file, setFile, setProfilePicUrl, pictureID }) => {
  const { progress, url } = useStorage(file, pictureID);
  // const [progress, setProgress] = useState(60)


  useEffect(() => {
    if (url) {
      setFile(null);
      url = url.substring(0, url.indexOf("?")) + "?alt=media";
      setProfilePicUrl(url);
    }
  }, [url, setFile]);

  return (
    // <motion.div className="pic-progress-bar"
    //   initial={{ width: 50 }}
    //   animate={{ width: progress + '%' }}
    // ></motion.div>
    <div className="progress-bar-container">
      <div className="pic-progress-bar" style={{width: progress+"%"}}>

      </div>
    </div>
  );
} 

export default ProgressBar;