# stylelint-statement-max-nesting-depth [![Build Status](https://travis-ci.org/davidtheclark/stylelint-statement-max-nesting-depth.svg)](https://travis-ci.org/davidtheclark/stylelint-statement-max-nesting-depth)

A [stylelint](https://github.com/stylelint/stylelint) custom rule to limit nesting depth.

This rule will cause stylelint to warn you whenever a nested rule or at-rule exceeds your specified depth.

## Installation

```
npm install stylelint-statement-max-nesting-depth
```

## Details

### With or without nesting blocks

This rule works with or without nesting blocks.
Sass and Less do not have nesting blocks; [the CSS Nesting Module draft](http://tabatkins.github.io/specs/css-nesting/) does.

Nesting *without* nesting blocks can be enabled with [postcss-nested](https://github.com/postcss/postcss-nested).

Nesting *with* nesting blocks can be enabled with [postcss-nesting](https://github.com/jonathantneal/postcss-nesting).

```css
/* without nesting blocks */
a {
  b { /* nesting level 1 */
    .foo { /* nesting level 2 */
      .bar { /* nesting level 3 */
        .baz { /* nesting level 4 */
          color: pink;
        }
      }
    }
  }
}

/* with nesting blocks */
a {{
  b {{ /* nesting level 1 */
    .foo {{ /* nesting level 2 */
      .bar {{ /* nesting level 3 */
        .baz {{ /* nesting level 4 */
          color: pink;
        }}
      }}
    }}
  }}
}}
```

### Nesting depth ignores root-level at-rules

Just like the heading said: root-level at-rules will not be included in the nesting depth calculation.

So both of the following `.foo` rules have a nesting depth of 2, and will therefore pass if you `max` is less than or equal to 2:

```css
a {
  b {
    .foo {}
  }
}

@media print {
  a {
    b {
      .foo {}
    }
  }
}
```

Why? Because I think that's how most users would want this thing to work. If you disagree, file an issue.

### Options

#### atRulesDontCount

Type `Boolean`; Default `false`

If `true` *no* at-rules (root-level or nested) will affect the calculation of a statement's nesting depth.

Both of the following `.foo` rules would have a nesting depth of `1`.

```
a {
  .foo {}
}

a {
  @media print {
    .foo {}
  }
}
```

## Usage

Add it to your stylelint config `plugins` object, then add it to your rules, specifying a max nesting depth as the second item of your settings array.

Like so:

```js
// myStylelintConfig.js
module.exports = {
  plugins: {
    'statement-max-nesting-depth': require('stylelint-statement-max-nesting-depth'),
  },
  rules: {
    // ...
    // The following settings = max nesting depth of 1,
    // with the option `atRulesDontCount` set to `true`
    'statement-max-nesting-depth': [2, 1, { atRulesDontCount: true }],
    // ...
  },
};
```
