import { useState, useEffect } from 'react';

function getWindowDimensions() {
  let width:number;
  let height:number;
  if(typeof window !== "undefined"){
    width = window?.innerWidth;
    height = window?.innerHeight;
  }else{
    width = 431;
    height = 431;
  }
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}