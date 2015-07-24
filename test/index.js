var ruleTester = require('stylelint').utils.ruleTester;
var rule = require('..');

var testRule = ruleTester(rule, rule.ruleName);

testRule.only(1, function(tr) {
  basics(tr);

  tr.ok('a { b { top: 0; }}', 'no nesting block');
  tr.ok('a {{ b { top: 0; }}}', 'nesting block');
  tr.notOk('a { b { c { top: 0; }}}', rule.messages.rejected);
  tr.notOk('a {{ b {{ c { top: 0; }}}}}', rule.messages.rejected, 'nesting block');

  tr.ok('@media print { a { b { top: 0; }}}', 'no nesting block');
  tr.ok('@media print { a {{ b { top: 0; }}}}', 'nesting block');
  tr.notOk('@media print { a { b { c { top: 0; }}}}', rule.messages.rejected);
  tr.notOk('@media print { a {{ b {{ c { top: 0; }}}}}}', rule.messages.rejected, 'nesting block');

  tr.ok('a { top: 0; { b { top: 0; }}}');
  tr.ok('a {{ b { top: 0; }} top: 0; }');
  tr.notOk('a { top: 0; { b { top: 0; { c { top: 0; }}}}}', rule.messages.rejected);
  tr.notOk('a { { b { top: 0; { c { top: 0; }}}} top: 0; }', rule.messages.rejected);
});

testRule(3, function(tr) {
  basics(tr);

  tr.ok('a { b { c { d { top: 0; }}}}', 'no nesting block');
  tr.ok('a {{ b {{ c {{ d { top: 0; }}}}}}}', 'nesting block');
  tr.notOk('a { b { c { d { e { top: 0; }}}}}', rule.messages.rejected);
  tr.notOk('a {{ b {{ c {{ d {{ e { top: 0; }}}}}}}}}', rule.messages.rejected, 'nesting block');

  tr.ok('@media print { a { b { c { d { top: 0; }}}}}', 'no nesting block');
  tr.ok('@media print { a {{ b {{ c {{ d { top: 0; }}}}}}}}', 'nesting block');
  tr.notOk(
    '@media print { a {{ b {{ c {{ d {{ e { top: 0; }}}}}}}}}}',
    rule.messages.rejected,
    'nesting block'
  );
});

function basics(tr) {
  tr.ok('');
  tr.ok('a {}');
  tr.ok('@import "foo.css";');
  tr.ok('a { top: 0; }');
}
