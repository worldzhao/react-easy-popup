import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Portal } from '../.';

const node = document.createElement('div');
node.className = 'react-easy-popup__test-node';
document.body.appendChild(node);

const App = () => {
  return (
    <div>
      <Portal>123</Portal>
      <Portal node={node}>456</Portal>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
