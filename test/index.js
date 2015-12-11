var ruleTester = require('stylelint-rule-tester');
var statementMaxNestingDepth = require('..');

var messages = statementMaxNestingDepth.messages;
var testRule = ruleTester(statementMaxNestingDepth.rule, statementMaxNestingDepth.ruleName);

testRule(1, function(tr) {
  basics(tr);

  tr.ok('a { b { top: 0; }}');
  tr.notOk('a { b { c { top: 0; }}}', messages.rejected);

  tr.ok('@media print { a { b { top: 0; }}}');
  tr.notOk('@media print { a { b { c { top: 0; }}}}', messages.rejected);

  tr.ok('a { top: 0; b { top: 0; }}');
  tr.notOk('a { top: 0; b { top: 0; c { top: 0; }}}', messages.rejected);
  tr.notOk('a { b { top: 0; c { top: 0; }} top: 0; }', messages.rejected);
});

testRule(3, function(tr) {
  basics(tr);

  tr.ok('a { b { c { d { top: 0; }}}}');
  tr.notOk('a { b { c { d { e { top: 0; }}}}}', messages.rejected);
  tr.ok('@media print { a { b { c { d { top: 0; }}}}}');
});

testRule(1, { countAtRules: false }, function(tr) {
  basics(tr);

  tr.ok('a { b { top: 0; }}');
  tr.ok('a { @media print { b { top: 0; }}}');
  tr.notOk('a { b { c { top: 0; }}}', messages.rejected);
  tr.notOk('a { @media print { b { c { top: 0; }}}}', messages.rejected);
});

testRule(1, { countNestedAtRules: false }, function(tr) {
  basics(tr);

  tr.ok('a { @media print { b { top: 0; }}}');
  tr.ok('a { b { @media print { top: 0; }}}');
  tr.notOk('a { b { @media print { c { top: 0; } }}}', messages.rejected);
  tr.notOk('a { @media print { b { c { top: 0; }}}}', messages.rejected);
});

function basics(tr) {
  tr.ok('');
  tr.ok('a {}');
  tr.ok('@import "foo.css";');
  tr.ok('a { top: 0; }');
}
