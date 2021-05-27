import * as React from 'react';

export default 'SvgrURL';
const SvgrMock = React.forwardRef((props, ref) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <span ref={ref} {...props} className="mockIcon" />;
});

export const ReactComponent = SvgrMock;
