import Proptypes from 'prop-types';
import React from 'react';

import { Wrapper } from './styles';

export default function DefaultLayout({ children }) {
  return <Wrapper>{children}</Wrapper>;
}

DefaultLayout.propTypes = {
  children: Proptypes.element.isRequired,
};
