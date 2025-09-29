// note!: reload vscode or restart eslint server for changes to take effect

// {
//   "plugins": [
//     // "remark-preset-wooorm",
//     "remark-preset-lint-consistent", // Check that markdown is consistent.
//     "remark-preset-lint-recommended", // Few recommended rules.
//     // `remark-lint-list-item-indent` is configured with `tab-size` in the
//     // recommended preset, but if we’d prefer something else, it can be
//     // reconfigured:
//     [
//       "remark-lint-list-item-indent",
//       "space"
//     ]
//     [
//       "remark-lint-no-html",
//       false
//     ],
//     [
//       "remark-lint-file-extension",
//       false
//     ],
//     [
//       "remark-lint-rule-style",
//       "consistent"
//     ],
//     [
//       "remark-stringify",
//       {
//         "rule": "-"
//       }
//     ],
//     [
//       "retext-quotes",
//       {
//         "preferred": "straight"
//       }
//     ]
//   ]
// }

// @see https://github.com/remarkjs/remark-lint/blob/ef0f45930a847030b00310949a8dd3ba257623a8/.remarkrc.js
// @see https://github.com/wix/Detox/blob/master/.remarkrc.mjs
// @see https://github.com/wooorm/remark-preset-wooorm/blob/154bf61e2091997ccb62ce3ae307f1d5dc99c011/index.js#L18
// @see https://github.com/lingui/js-lingui/blob/52a30f933326d5eeaaf83dba2590f095b99a347e/website/.remarkrc.mjs#L4

// import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
// import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkStringify from 'remark-stringify'
import remarkMdx from 'remark-mdx'
// import remarkParse from 'remark-parse'
import remarkPresetWoorm from 'remark-preset-wooorm'
// import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length'
// import remarkFrontmatter from 'remark-frontmatter'
// import remarkLint from 'remark-lint'
import remarkGfm from 'remark-gfm-v3'
import remarkPreset from '@1stg/remark-preset'
import remarkValidateLinks from 'remark-validate-links'
import remarkRetext from 'remark-retext'
import { unified } from 'unified'
import retextEnglish from 'retext-english'
// import remarkLintFileExtension from 'remark-lint-file-extension'
import retextPresetWooorm from 'retext-preset-wooorm'
import retextQuotes from 'retext-quotes'
import retextSentenceSpacing from 'retext-sentence-spacing'
import retextContractions from 'retext-contractions'
// import remarkLintNoConsecutiveBlankLines from 'remark-lint-no-consecutive-blank-lines'
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value'

// note: `remarkValidateLinks` does not support .mdx extension https://github.com/remarkjs/remark-validate-links/blob/1a7f038d143272b389e84e8828f23150e8e6cb29/lib/find/find-references.js#L36
// note: remove `remarkValidateLinks` since it cannot be later turned off
// remarkPresetWoorm.plugins.shift()
// remarkPresetWoorm.plugins.splice(0, 1)
// remarkPresetWoorm.plugins.splice(2, 1)
remarkPresetWoorm.plugins.splice(3, 1)
remarkPreset.plugins.splice(7, 1)

/** @type {Array<import('unified').Plugin | import('unified').Preset>} */
const plugins = [
  // note: incl. code/node indenting
  remarkPresetWoorm,
  // // note: https://github.com/retextjs/retext-quotes/issues/6
  // [
  //   remarkRetext,
  //   unified()
  //     .use(retextEnglish)
  //     // .use({ plugins: ['retext-quotes'] })
  //     .use(remarkPresetWoorm)
  //     // .use({
  //     //   plugins: [retextEnglish, remarkPresetWoorm],
  //     //   settings: { position: false },
  //     // })
  //     // .use({
  //     //   plugins: [retextEnglish, remarkPresetWoorm],
  //     //   settings: { position: { start: { line: 1, column: 1, offset: 0 } } },
  //     // })
  //     // .use({ plugins: ['remark-lint-file-extension', false] }),
  //     // .use({ settings: { position: false } }),
  //     // .use({
  //     //   settings: {
  //     //     position: {
  //     //       start: { line: 1, column: 1, offset: 0 },
  //     //     },
  //     //   },
  //     // }),
  //     .use(remarkGfm)
  //     .use(remarkMdx)
  //     // .use(remarkLintNoConsecutiveBlankLines, false)
  //     .use(remarkLintListItemIndent, 'space')
  //     .use(remarkStringify, { listItemIndent: 'one', rule: '-' })
  //     .use(remarkLintFileExtension, false)
  //     .use(remarkLintMaximumLineLength, false),
  // ],
  [
    remarkRetext,
    unified()
      .use(retextEnglish)
      .use(retextPresetWooorm)
      .use(retextQuotes, { preferred: 'straight' })
      .use(retextSentenceSpacing, { preferred: 'space' })
      .use(retextContractions, { straight: true }),
  ],

  // remarkPresetLintConsistent,
  // remarkPresetLintRecommended,
  // remarkPresetLintMarkdownStyleGuide,
  'remark-preset-lint-consistent',
  'remark-preset-lint-markdown-style-guide',
  'remark-preset-lint-recommended',
  // [remarkLintFileExtension, 'mdx'],

  // note: incl. character escaping
  remarkPreset,

  // remarkLint,
  // [remarkFrontmatter, { type: 'custom', marker: { open: '<', close: '>' } }],
  [remarkLintListItemIndent, 'space'],
  [
    remarkStringify,
    { listItemIndent: 'one', rule: '-', incrementListMarker: false },
  ],
  remarkMdx,
  // remarkParse,
  [remarkLintMaximumLineLength, 'off'],
  remarkGfm,
  ['remark-lint-no-html', false],
  ['remark-lint-emphasis-marker', '_'],
  ['remark-lint-no-undefined-references'],

  ['remark-lint-heading-style', false],
  ['remark-lint-list-item-indent', false],
  ['remark-lint-maximum-heading-length', false],
  ['remark-lint-maximum-line-length', false],
  ['remark-lint-no-duplicate-headings', false],
  ['remark-lint-no-duplicate-headings-in-section', false],
  ['remark-lint-list-item-spacing', false],
  ['remark-lint-heading-increment', false],

  ['remark-lint-emphasis-marker', '_'],

  // ['remark-lint-file-extension'],
  ['remark-lint-file-extension', false],
  ['remark-lint-no-emphasis-as-heading', false],
  ['remark-lint-table-pipe-alignment', false],
  [
    remarkValidateLinks,
    { repository: 'https://github.com/status-im/status-website.git' },
  ],
  // [remarkValidateLinks, false],
  // note: use https://github.com/orgs/remarkjs/discussions/734#discussioncomment-819364 --frail option
  // [remarkValidateLinks, [2]],
  // ['remark-validate-links', false],
  // ['remark-validate-links-missing-file', false],
  // ['remark-validate-links', 'error'],
  // ['remark-validate-links', [2]],
  // ['remark-validate-links'],
  // ['remark-validate-links-missing-file', 'off'],

  // ['retext-quotes-quote', { preferred: 'straight' }],
  // ['retext-quotes-quote', false],
  // ['retext-quotes-quote', 'off'],
  // ['retext-quotes', false],
  // ['remark-lint-no-consecutive-blank-lines', false],

  ['remark-lint-first-heading-level', false],

  // note: resets rules like `'remark-lint-maximum-line-length'`
  ['remark-preset-prettier'],

  ['remark-lint-ordered-list-marker-value', false],
  // ['remark-lint-ordered-list-marker-value', 'one'],
  [remarkLintOrderedListMarkerValue, 'one'],
  ['remark-github', false],
]

/** @type {import('unified').Preset} */
export default {
  settings: {
    emphasis: '_',
    bullet: '-',
    quote: '"',
    // position: {
    //   start: { line: 1, column: 1, offset: 0 },
    // },
    //  position: false
  },
  plugins,
}
