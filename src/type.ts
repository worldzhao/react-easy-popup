export type PortalProps = React.PropsWithChildren<{
  node?: HTMLElement;
}>;

export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';

type PopupPropsWithoutChildren = {
  node?: HTMLElement;
} & typeof defaultProps;

export type PopupProps = React.PropsWithChildren<PopupPropsWithoutChildren>;

// Popup默认属性
export const defaultProps = {
  visible: false,
  position: 'center' as const,
  mask: true,
  maskClosable: false,
  onClose: () => {},
  stopScrollUnderMask: false,
  destroyOnClose: false,
  wrapClassName: '',
};