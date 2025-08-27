import React from 'react';
import {SvgXml} from 'react-native-svg';

const PlayIcon: React.FC<{fill: string;width?: number; height?: number}> = ({fill,width = 29, height = 29}) => {
  const svgXmlData = `
    <svg width="${width}" height="${height}" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14.5" cy="14.5" r="14.5" fill="#FF8D08"/>
      <path d="M21 15L11.25 20.1962L11.25 9.80385L21 15Z" fill="${fill}"/>
    </svg>
  `;

  return <SvgXml xml={svgXmlData} />;
};

export default PlayIcon;
