import React from 'react';

import { storiesOf } from '@storybook/react';
import Demo from '../src/index'

storiesOf('Demo', module)
  .add('base', () => <Demo></Demo>);
