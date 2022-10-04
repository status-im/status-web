// todo: remove, 'cuase 2 libs 1 thing
// import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components'

// xxx?: how was this generated; template for reseting (stylesheets; normalize css; for apps)
// xxx?: how does this work in embedded context
// note: reseting styles; only for its childs
// note: selector, e.g. "> *" : { // css }
// note: iframe; e.g. Intercom; separate context in browser; not accesible from "parent" page; not applies style
// note: iframe; difficult; not responsive; check height and width of iframe; pitfalls; not allows consumers to update styles; theme props
// export const GlobalStyle = createGlobalStyle`
export const Wrapper2 = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  // background: '$background';

  // // & * {
  // //   box-sizing: border-box;
  // //   -webkit-font-smoothing: antialiased;

  // //   &::-webkit-scrollbar {
  // //     width: 0;
  // //   }
  // // }

  // margin: 0;
  // font-family: 'Inter', sans-serif;
  // font-size: 15px;
  // // line-height: 22px;

  // // // note: does not work as expected
  // // :where(#foo) div,
  // // :where(&) div,
  // & div,
  // span,
  // applet,
  // object,
  // iframe,
  // h1,
  // h2,
  // h3,
  // h4,
  // h5,
  // h6,
  // p,
  // blockquote,
  // pre,
  // a,
  // abbr,
  // acronym,
  // address,
  // big,
  // cite,
  // code,
  // del,
  // dfn,
  // em,
  // img,
  // ins,
  // kbd,
  // q,
  // s,
  // samp,
  // small,
  // strike,
  // strong,
  // sub,
  // sup,
  // tt,
  // var,
  // b,
  // u,
  // i,
  // center,
  // dl,
  // dt,
  // dd,
  // ol,
  // ul,
  // li,
  // fieldset,
  // form,
  // label,
  // legend,
  // table,
  // caption,
  // tbody,
  // tfoot,
  // thead,
  // tr,
  // th,
  // td,
  // article,
  // aside,
  // canvas,
  // details,
  // embed,
  // figure,
  // figcaption,
  // footer,
  // header,
  // hgroup,
  // menu,
  // nav,
  // output,
  // ruby,
  // section,
  // summary,
  // time,
  // mark,
  // audio,
  // video {
  //   margin: 0;
  //   padding: 0;
  //   border: 0;
  //   vertical-align: baseline;
  // }

  // & article,
  // aside,
  // details,
  // figcaption,
  // figure,
  // footer,
  // header,
  // hgroup,
  // menu,
  // nav,
  // section {
  //   display: block;
  // }

  // // body {
  // // line-height: 147%;
  // // }

  // & ol,
  // ul {
  //   list-style: none;
  // }

  // & blockquote,
  // q {
  //   quotes: none;
  // }

  // & blockquote:before,
  // blockquote:after,
  // q:before,
  // q:after {
  //   content: '';
  //   content: none;
  // }

  // & table {
  //   border-collapse: collapse;
  //   border-spacing: 0;
  // }

  // & button {
  //   border: none;
  //   background: none;
  //   cursor: pointer;
  // }

  // & a {
  //   text-decoration: none;
  //   cursor: pointer;
  // }
`
