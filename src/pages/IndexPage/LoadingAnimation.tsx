// LoadingAnimation.tsx
import React from 'react';
import './LoadingAnimation.css'; // 这里你将定义一些CSS样式

interface LoadingAnimationProps {
  show:boolean; // 是否显示加载动画
  progress: number; // 加载进度百分比
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ show,progress }) => {
  return (
    <div className={show ? 'loading-container' : 'loading-container hidden'}>
      <div className='loading-content'>
      <div className="loader"></div> {/* 旋转的图标 */}
      <div className="progress">{progress}%</div> {/* 加载进度百分比 */}
      </div>
    </div>
  );
};

export default LoadingAnimation;
