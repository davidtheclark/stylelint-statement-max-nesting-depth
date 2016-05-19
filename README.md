# stylelint-statement-max-nesting-depth

[![Build Status](https://travis-ci.org/davidtheclark/stylelint-statement-max-nesting-depth.svg)](https://travis-ci.org/davidtheclark/stylelint-statement-max-nesting-depth)

**Deprecated: use stylelint's [`max-nesting-depth`](https://github.com/stylelint/stylelint/tree/master/src/rules/max-nesting-depth) rule instead.**

A [stylelint](https://github.com/stylelint/stylelint) custom rule to limit nesting depth.

This rule will cause stylelint to warn you whenever a nested rule or at-rule exceeds your specified depth.

## Installation

```
npm install stylelint-statement-max-nesting-depth
```

v2+ is compatible with stylelint v3+. For older versions of stylelint, use older versions of this plugin.

## Details

Preprocessers like Sass, Less, and Stylus have nesting. Nesting can be enabled via PostCSS with [postcss-nested](https://github.com/postcss/postcss-nested) or [postcss-nesting](https://github.com/jonathantneal/postcss-nesting).

Here's how it works:

```css
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

#### countAtRules

Type `Boolean`; Default `true`

If `false` *no* at-rules (root-level or nested) will affect the calculation of a statement's nesting depth.

Both of the following `.foo` rules would have a nesting depth of `1`.

```css
a {
  .foo {}
}

a {
  @media print {
    .foo {}
  }
}
```

#### countNestedAtRules

Type `Boolean`; Default `true`

If `false`, nested at-rules will not affect the calculation of a statement's nesting depth.

None of the following would involve a nesting depth greater than `1`.

```css
a {
  .foo {}
}

a {
  @media print {
    .foo {}
  }
}

a {
  .foo {
    @media print {
      color: pink;
    }
  }
}
```

## Usage

Add it to your stylelint config `plugins` array, then add '`statement-max-nesting-depth'` to your rules, specifying a max nesting depth as the primary option.

Like so:

```js
{
  "plugins": [
    "stylelint-statement-max-nesting-depth"
  ],
  "rules": {
    // ...
    // The following settings = max nesting depth of 1,
    // with the option `countAtRules` set to `false`
    "statement-max-nesting-depth": [1, { countAtRules: false }],
    // ...
  },
};
```
