import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import { Popup } from '../.';
import '../dist/react-easy-popup.min.css';

const Button = styled.button`
  width: 120px;
  height: 40px;
  background-color: orange;
  color: #fff;
  border-radius: 4px;
  margin-bottom: 10px;
  display: block;
  outline: none;
`;

const common = css`
  background-color: #fcfcfc;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenterContent = styled.div`
  ${common}
  height: 40px;
  border-radius: 4px;
`;

const TopContent = styled.div`
  ${common}
  height: 10px;
`;

const BottomContent = styled.div`
  ${common}
  height: 100px;
`;

const LeftContent = styled.div`
  ${common}
  height: 100%;
  width: 200px;
`;

const RightContent = styled.div`
  ${common}
  height:100%;
  width: 200px;
`;

const { useState } = React;

const App = () => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [visible6, setVisible6] = useState(false);
  const [visible7, setVisible7] = useState(false);

  return (
    <div>
      <Button onClick={() => setVisible1(true)}>center</Button>
      <Popup maskClosable visible={visible1} onClose={() => setVisible1(false)}>
        <CenterContent>center</CenterContent>
      </Popup>

      <Button onClick={() => setVisible2(true)}>left</Button>
      <Popup
        maskClosable
        position="left"
        visible={visible2}
        onClose={() => setVisible2(false)}
      >
        <LeftContent>left</LeftContent>
      </Popup>

      <Button onClick={() => setVisible3(true)}>right</Button>
      <Popup
        maskClosable
        position="right"
        visible={visible3}
        onClose={() => setVisible3(false)}
      >
        <RightContent>right</RightContent>
      </Popup>

      <Button onClick={() => setVisible4(true)}>top</Button>
      <Popup
        maskClosable
        position="top"
        visible={visible4}
        onClose={() => setVisible4(false)}
      >
        <TopContent>top</TopContent>
      </Popup>

      <Button onClick={() => setVisible5(true)}>bottom</Button>
      <Popup
        maskClosable
        position="bottom"
        visible={visible5}
        onClose={() => setVisible5(false)}
      >
        <BottomContent>bottom</BottomContent>
      </Popup>

      <Button
        onClick={() => {
          setVisible6(true);
          setTimeout(() => {
            setVisible6(false);
          }, 3000);
        }}
      >
        no mask
      </Button>
      <Popup mask={false} visible={visible6}>
        <CenterContent>popup without mask</CenterContent>
      </Popup>

      <Button onClick={() => setVisible7(true)}>destroyOnClose</Button>
      <Popup
        destroyOnClose
        maskClosable
        visible={visible7}
        onClose={() => setVisible7(false)}
      >
        <CenterContent>destroy content on close</CenterContent>
      </Popup>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
