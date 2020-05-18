import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Popup />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
