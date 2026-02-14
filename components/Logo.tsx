import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

/**
 * Logo 组件
 * 基于 logo.svg 转换
 */
export const Logo = (props: SvgProps) => (
  <Svg viewBox="0 0 1024 1024" width={200} height={200} {...props}>
    <Path
      d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
      fill="#7dc5eb"
    />
    <Path
      d="M512 512m-398.222222 0a398.222222 398.222222 0 1 0 796.444444 0 398.222222 398.222222 0 1 0-796.444444 0Z"
      fill="#333333"
    />
    <Path
      d="M426.666667 284.444444v312.888889h256v-85.333333h-170.666667v-227.555556z"
      fill="#7dc5eb"
    />
  </Svg>
);
