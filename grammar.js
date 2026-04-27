/**
 * @file Handlebars is largely compatible with Mustache templates. In most cases it is possible to swap out Mustache with Handlebars and continue using your current templates.
 * @author Benny Powers <web@bennypowers.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "handlebars",

  externals: ($) => [$.comment_content, $.raw_block_content],

  extras: ($) => [/\s/],

  word: ($) => $.identifier,

  rules: {
    template: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.text,
        $.expression,
        $.raw_expression,
        $.block,
        $.partial,
        $.partial_block,
        $.inline_partial,
        $.comment,
        $.raw_block,
        $.decorator,
        $.block_decorator,
      ),

    text: ($) =>
      prec.right(
        repeat1(
          choice(token(prec(1, /[^{]+/)), token(prec(-1, /\{/))),
        ),
      ),

    expression: ($) =>
      seq("{{", optional("~"), optional("&"), $._call, optional("~"), "}}"),

    raw_expression: ($) =>
      seq("{{{", optional("~"), $._call, optional("~"), "}}}"),

    block: ($) =>
      seq(
        $.block_open,
        repeat(choice($._statement, $.else_block)),
        $.block_close,
      ),

    block_open: ($) =>
      seq(
        "{{",
        optional("~"),
        "#",
        $._call,
        optional($.block_params),
        optional("~"),
        "}}",
      ),

    block_close: ($) =>
      seq("{{", optional("~"), "/", $.path_expression, optional("~"), "}}"),

    else_block: ($) =>
      seq("{{", optional("~"), "else", optional($._call), optional("~"), "}}"),

    partial: ($) =>
      seq(
        "{{",
        optional("~"),
        ">",
        $._partial_name,
        repeat(choice($._value, $.hash_pair)),
        optional("~"),
        "}}",
      ),

    partial_block: ($) =>
      seq(
        $.partial_block_open,
        repeat($._statement),
        $.block_close,
      ),

    partial_block_open: ($) =>
      seq(
        "{{",
        optional("~"),
        "#>",
        $._partial_name,
        repeat(choice($._value, $.hash_pair)),
        optional("~"),
        "}}",
      ),

    inline_partial: ($) =>
      seq($.inline_partial_open, repeat($._statement), $.block_close),

    inline_partial_open: ($) =>
      seq(
        "{{",
        optional("~"),
        token(seq("#*", /inline/)),
        $.string_literal,
        optional("~"),
        "}}",
      ),

    comment: ($) =>
      choice(
        seq(
          "{{",
          optional("~"),
          "!--",
          optional($.comment_content),
          optional("~"),
          "}}",
        ),
        seq(
          "{{",
          optional("~"),
          "!",
          optional(token.immediate(/([^}~]|\}[^}]|~[^}])+/)),
          optional("~"),
          "}}",
        ),
      ),

    raw_block: ($) =>
      seq(
        $.raw_block_open,
        optional($.raw_block_content),
        $.raw_block_close,
      ),

    raw_block_open: ($) => seq("{{{{", $.identifier, "}}}}"),
    raw_block_close: ($) => seq("{{{{/", $.identifier, "}}}}"),

    decorator: ($) =>
      seq("{{", optional("~"), "*", $._call, optional("~"), "}}"),

    block_decorator: ($) =>
      seq($.block_decorator_open, repeat($._statement), $.block_close),

    block_decorator_open: ($) =>
      seq("{{", optional("~"), "#*", $._call, optional("~"), "}}"),

    _call: ($) =>
      prec.left(
        seq(
          choice($.path_expression, $.subexpression),
          repeat(choice($._value, $.hash_pair)),
        ),
      ),

    _value: ($) =>
      choice(
        $.path_expression,
        $.string_literal,
        $.number_literal,
        $.boolean_literal,
        $.null_literal,
        $.subexpression,
      ),

    subexpression: ($) => seq("(", $._call, ")"),

    hash_pair: ($) => seq($.identifier, "=", $._value),

    block_params: ($) => seq("as", "|", repeat1($.identifier), "|"),

    path_expression: ($) =>
      prec.right(
        choice(
          seq(repeat1(seq("..", "/")), $._path_chain),
          seq("this", optional(seq(".", $._path_chain))),
          seq("./", $._path_chain),
          ".",
          $._path_chain,
        ),
      ),

    _path_chain: ($) =>
      prec.right(seq($._path_segment, repeat(seq(".", $._path_segment)))),

    _path_segment: ($) => choice($.identifier, $.segment_literal),

    segment_literal: ($) => seq("[", /[^\]]+/, "]"),

    _partial_name: ($) =>
      choice($.path_expression, $.subexpression, $.string_literal),

    string_literal: ($) => choice(/"([^"\\]|\\.)*"/, /'([^'\\]|\\.)*'/),

    number_literal: ($) => /-?[0-9]+(\.[0-9]+)?/,

    boolean_literal: ($) => choice("true", "false"),

    null_literal: ($) => choice("null", "undefined"),

    identifier: ($) => /[@a-zA-Z_$][\w$-]*/,
  },
});
