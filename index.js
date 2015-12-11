var assign = require('object-assign');
var stylelint = require('stylelint');

var ruleName = 'statement-max-nesting-depth';

var messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'Nesting exceeds maximum nesting depth',
});

module.exports = stylelint.createPlugin(ruleName, function(max, options) {
  // Set defaults
  options = assign({
    countNestedAtRules: true,
  }, options);

  return function(root, result) {
    stylelint.utils.validateOptions({
      ruleName: ruleName,
      result: result,
      actual: max,
      possible: [function(x) { return typeof x === 'number'; }],
    });
    stylelint.utils.validateOptions({
      ruleName: ruleName,
      result: result,
      actual: options,
      possible: {
        atRulesDontCount: [true, false],
        countNestedAtRules: [true, false],
      },
    });

    root.walkRules(checkStatement);
    root.walkAtRules(checkStatement);

    function checkStatement(statement) {
      if (statement.type === 'rule' && !statement.selector) return;
      const depth = nestingDepth(statement);
      if (depth > max) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: statement,
          message: messages.rejected
        });
      }
    }
  };

  function nestingDepth(node, level) {
    level = level || 0;

    // The nesting depth level's computation has finished
    // when this function, recursively called, receives
    // a node that is not nested -- a direct child of the
    // root node
    if (node.parent.type === 'root') {
      return level;
    }

    if (node.parent.type === 'atrule') {
      // Conditions under which at-rules' children don't count
      if (
        options.atRulesDontCount
        || node.parent.parent.type === 'root'
      ) {
        return nestingDepth(node.parent, level);
      }
    }

    if (node.parent.type === 'rule') {
      // Conditions under which rules' children don't count
      if (
        !node.parent.selector
        || (node.type === 'atrule' && !options.countNestedAtRules)
      ) {
        return nestingDepth(node.parent, level);
      }
    }

    // Unless any of the conditions above apply, we want to
    // add 1 to the nesting depth level and then check the parent,
    // continuing to add until we hit the root node
    return nestingDepth(node.parent, level + 1);
  }
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
