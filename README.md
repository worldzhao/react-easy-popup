<h1 align="center">Welcome to react-easy-popup 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

### 🏠 [Homepage](https://worldzhao.github.io/react-easy-popup)

React Component based on `ReactDOM.createPortal` function for transportation element.

## Install

```sh
yarn add react-easy-popup

# or

npm i react-easy-popup
```

## Usage

```jsx
import React, { useState } from 'react';
import { Popup } from 'react-easy-popup';
import 'react-easy-popup/dist/react-easy-popup.min.css';

export default () => {
  const [visible, setVisible] = useState(false);
  return (
    <Popup
      maskClosable
      visible={visible}
      onClose={() =>
        setVisible(false);
      }
    >
      <div className="your-content">hello world</div>
    </Popup>
  );
};
```

## API

| Property       | Description                                                                                    | Type                                           | Default  |
| -------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------- |
| visible        | Optional，control content visibility                                                           | boolean                                        | false    |
| position       | Optional，determines where the content will pop up                                             | 'center' / 'top' / 'bottom' / 'left' / 'right' | 'center' |
| mask           | Optional，decide whether to display the background layer                                       | boolean                                        | true     |
| maskClosable   | Optional，if the value is true, clicking on the background layer will trigger onClose function | boolean                                        | false    |
| onClose        | Optional，a function to set the visible to false                                               | function                                       | ()=>{}   |
| node           | Optional，the mounted node                                                                     | HTMLElement                                    | -        |
| destroyOnClose | Optional，whether content nodes are unloaded when closed                                       | boolean                                        | false    |
| wrapClassName  | Optional，className for the container node                                                     | string                                         | ''       |

## Contributions Welcome!

```sh
git clone git@github.com:worldzhao/react-easy-popup.git
cd react-easy-popup
yarn
yarn start
```

open another terminal tab

```sh
cd example
yarn
yarn start
```

## Run tests

```sh
yarn test
```

## Author

👤 **海秋**

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
