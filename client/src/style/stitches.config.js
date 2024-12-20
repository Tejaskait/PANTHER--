import { createStitches } from '@stitches/react';

export const { styled, globalCss, css } = createStitches({
  utils: {
    p: (value) => ({ padding: value }),
    m: (value) => ({ margin: value }),
    mx: (value) => ({ marginLeft: value, marginRight: value }),
    my: (value) => ({ marginTop: value, marginBottom: value }),
  },
});
