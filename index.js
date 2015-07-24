var utils = require('stylelint').utils;

var ruleName = 'statement-max-nesting-depth';

var messages = utils.ruleMessages(ruleName, {
  rejected: 'Nesting exceeds maximum nesting depth',
});

module.exports = function(max) {
  return function(root, result) {
    root.eachRule(checkStatement);
    root.eachAtRule(checkStatement);

    function checkStatement(statement) {
      if (statement.type === "rule" && !statement.selector) return;
      const depth = nestingDepth(statement);
      if (depth > max) {
        utils.report({
          ruleName: ruleName,
          result: result,
          node: statement,
          message: messages.rejected
        });
      }
    }
  };
};

function nestingDepth(node, level) {
  level = level || 0;
  if (node.parent.type === 'root') {
    return level;
  }
  if (
    node.parent.type === 'atrule' && node.parent.parent.type === 'root'
    || (node.parent.type === 'rule' && !node.parent.selector)) {
    return nestingDepth(node.parent, level);
  }
  return nestingDepth(node.parent, level + 1);
}

module.exports.ruleName = ruleName;
module.exports.messages = messages;
