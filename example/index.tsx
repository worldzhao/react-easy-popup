import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Popup } from '../.';
import '../dist/react-easy-popup.min';

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
      <button onClick={() => setVisible1(true)}>center</button>
      <Popup maskClosable visible={visible1} onClose={() => setVisible1(false)}>
        123
      </Popup>

      <br />

      <button onClick={() => setVisible2(true)}>left</button>
      <Popup
        maskClosable
        position="left"
        visible={visible2}
        onClose={() => setVisible2(false)}
      >
        123
      </Popup>

      <br />

      <button onClick={() => setVisible3(true)}>right</button>
      <Popup
        maskClosable
        position="right"
        visible={visible3}
        onClose={() => setVisible3(false)}
      >
        123
      </Popup>

      <br />

      <button onClick={() => setVisible4(true)}>top</button>
      <Popup
        maskClosable
        position="top"
        visible={visible4}
        onClose={() => setVisible4(false)}
      >
        123
      </Popup>

      <br />

      <button onClick={() => setVisible5(true)}>bottom</button>
      <Popup
        maskClosable
        position="bottom"
        visible={visible5}
        onClose={() => setVisible5(false)}
      >
        123
      </Popup>

      <br />

      <button
        onClick={() => {
          setVisible6(true);
          setTimeout(() => {
            setVisible6(false);
          }, 3000);
        }}
      >
        no mask
      </button>
      <Popup mask={false} visible={visible6}>
        123
      </Popup>

      <br />

      <button onClick={() => setVisible7(true)}>destroyOnClose</button>
      <Popup
        destroyOnClose
        maskClosable
        visible={visible7}
        onClose={() => setVisible7(false)}
      >
        123
      </Popup>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
