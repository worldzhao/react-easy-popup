import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Portal from './portal';
import { PopupProps, Position, defaultProps } from './type';
import './index.less';

// 类名前缀
const prefixCls = 'react-easy-popup';
// 动画时长
const duration = 300;
// 位置与动画的映射
const animations: { [key in Position]: string } = {
  bottom: `${prefixCls}-slide-up`,
  right: `${prefixCls}-slide-left`,
  left: `${prefixCls}-slide-right`,
  top: `${prefixCls}-slide-down`,
  center: `${prefixCls}-fade`,
};

const Popup = (props: PopupProps) => {
  const firstRenderRef = React.useRef(false);

  const { visible } = props;

  if (!firstRenderRef.current && !visible) return null;
  if (!firstRenderRef.current) {
    firstRenderRef.current = true;
  }

  const {
    node,
    mask,
    maskClosable,
    onClose,
    wrapClassName,
    position,
    destroyOnClose,
    children,
  } = props;

  // 蒙层点击事件
  const onMaskClick = () => {
    if (maskClosable) {
      onClose();
    }
  };

  // 拼接容器节点类名
  const rootCls = classnames(
    prefixCls,
    wrapClassName,
    `${prefixCls}__${position}`
  );

  // 拼接蒙层节点类名
  const maskCls = classnames(`${prefixCls}-mask`, {
    [`${prefixCls}-mask__visible`]: mask,
  });

  // 拼接内容节点类名
  const contentCls = classnames(
    `${prefixCls}-content`,
    `${prefixCls}-content__${position}`
  );

  // 内容过渡动画
  const contentAnimation = animations[position];

  return (
    <Portal node={node}>
      <div className={rootCls}>
        <CSSTransition
          in={visible}
          timeout={duration}
          classNames={`${prefixCls}-fade`}
          appear
        >
          <div className={maskCls} onClick={onMaskClick}></div>
        </CSSTransition>
        <CSSTransition
          in={visible}
          timeout={duration}
          classNames={contentAnimation}
          unmountOnExit={destroyOnClose}
          appear
        >
          <div className={contentCls}>{children}</div>
        </CSSTransition>
      </div>
    </Portal>
  );
};

Popup.propTypes = {
  visible: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left', 'center']),
  mask: PropTypes.bool,
  maskClosable: PropTypes.bool,
  onClose: PropTypes.func,
  stopScrollUnderMask: PropTypes.bool,
  destroyOnClose: PropTypes.bool,
  wrapClassName: PropTypes.string,
};

Popup.defaultProps = defaultProps;

export default Popup;
