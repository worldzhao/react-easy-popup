import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { PortalProps } from './type';

// 判断是否为浏览器环境
const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const Portal = ({ node, children }: PortalProps) => {
  // 使用ref记录内部创建的节点 初始值为null
  const defaultNodeRef = React.useRef<HTMLElement | null>(null);

  // 组件卸载时 移除该节点
  React.useEffect(
    () => () => {
      if (defaultNodeRef.current) {
        document.body.removeChild(defaultNodeRef.current);
      }
    },
    []
  );

  // 如果非浏览器环境 直接返回 null 服务端渲染需要
  if (!canUseDOM) return null;

  // 若用户未传入节点，Portal也未创建节点，则创建节点并添加至body
  if (!node && !defaultNodeRef.current) {
    const defaultNode = document.createElement('div');
    defaultNode.className = 'react-easy-popup__portal';
    defaultNodeRef.current = defaultNode;
    document.body.appendChild(defaultNode);
  }

  return ReactDOM.createPortal(children, (node || defaultNodeRef.current)!);
};

Portal.propTypes = {
  node: canUseDOM ? PropTypes.instanceOf(HTMLElement) : PropTypes.any,
  children: PropTypes.node,
};

export default Portal;
