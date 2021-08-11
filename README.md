# Suit-UI

snowpack 과 rebass 를 같이 사용하려니 많은 애로사항이 발생해 직접 만들었습니다.
React UI library 입니다.

#### **[Demo](https://ysm1180.github.io/Suit-UI/)**

## Installation

```shell
npm install @ysm1180/suit-ui
# or
yarn add @ysm1180/suit-ui
```

## Usage

```typescript
import React from 'react';
import { Box, Button } from '@ysm1180/suit-ui';

function App() {
  return <Box><Button size="sm">Hello world!</Button></Box>
}

```

`VirtualTable` 컴포넌트를 사용한다면 style css를 import 해주어야한다.

```typescript
// index.tsx
import '@ysm1180/suit-ui/dist/style.css';
```
