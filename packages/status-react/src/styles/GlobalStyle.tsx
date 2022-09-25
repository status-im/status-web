import { createGlobalStyle } from 'styled-components'

// xxx?: how was this generated
export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;

    // @see https://stackoverflow.com/questions/16670931/hide-scroll-bar-but-while-still-being-able-to-scroll
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      // display: none;
    }
  }

  body,
  html {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 22px;
  }

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    // xxx?: why not; hides popover, reply bar, emoji reaction, create profile
    // overflow: hidden;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  body {
    line-height: 147%;
  }

  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  body {
    overflow: hidden; // prevent dragging of the whole page in either direction
  }
`
