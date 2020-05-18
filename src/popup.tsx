import * as React from 'react';
import PropTypes from 'prop-types';

// import Portal from './portal';
import { PopupProps, defaultProps } from './type';
import './index.less';

const Popup = (props: PopupProps) => {
  console.log(props);
  return <div className="react-easy-popup">hello,react-easy-popup</div>;
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
