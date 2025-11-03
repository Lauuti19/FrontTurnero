// hooks/useVideoModal.js
import { useState } from 'react';

export const useVideoModal = () => {
  const [videoUrl, setVideoUrl] = useState(null);

  const openVideoModal = (url) => setVideoUrl(url);
  const closeVideoModal = () => setVideoUrl(null);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    return url.replace("watch?v=", "embed/");
  };

  return {
    videoUrl,
    openVideoModal,
    closeVideoModal,
    getEmbedUrl
  };
};