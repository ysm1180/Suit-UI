# Suit-UI

React UI library 입니다.

#### **[Demo](https://ysm1180.github.io/suit-ui/)**

## Installation

```shell
npm install suit-ui
# or
yarn add suit-ui
```

## Usage

```typescript
import React from 'react';
import { Button } from 'suit-ui';

function App() {
  return <Button size="sm">Hello world!</Button>
}

```

`VirtualTable` 컴포넌트를 사용한다면 style css를 import 해주어야한다.

```typescript
// index.tsx
import 'suit-ui/dist/style.css';
```
