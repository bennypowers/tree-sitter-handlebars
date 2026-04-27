#include "tree_sitter/parser.h"

enum TokenType {
  COMMENT_CONTENT,
  RAW_BLOCK_CONTENT,
};

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

void *tree_sitter_handlebars_external_scanner_create(void) { return NULL; }

void tree_sitter_handlebars_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_handlebars_external_scanner_serialize(void *payload,
                                                           char *buffer) {
  return 0;
}

void tree_sitter_handlebars_external_scanner_deserialize(void *payload,
                                                         const char *buffer,
                                                         unsigned length) {}

static bool scan_comment_content(TSLexer *lexer) {
  // Scans content of {{!-- ... --}} comments.
  // Content INCLUDES the terminating "--" before }} or ~}}.
  // Tracks consecutive dashes; terminates when 2+ dashes precede }} or ~}}.
  bool has_content = false;
  int dashes = 0;

  while (lexer->lookahead != 0) {
    if (lexer->lookahead == '-') {
      dashes++;
      advance(lexer);
      has_content = true;
    } else if (dashes >= 2 && lexer->lookahead == '}') {
      lexer->mark_end(lexer);
      advance(lexer);
      if (lexer->lookahead == '}') {
        lexer->result_symbol = COMMENT_CONTENT;
        return has_content;
      }
      has_content = true;
      dashes = 0;
    } else if (dashes >= 2 && lexer->lookahead == '~') {
      lexer->mark_end(lexer);
      advance(lexer);
      if (lexer->lookahead == '}') {
        advance(lexer);
        if (lexer->lookahead == '}') {
          lexer->result_symbol = COMMENT_CONTENT;
          return has_content;
        }
        has_content = true;
        dashes = 0;
      } else {
        has_content = true;
        dashes = 0;
      }
    } else {
      dashes = 0;
      advance(lexer);
      has_content = true;
    }
  }
  return false;
}

static bool scan_raw_block_content(TSLexer *lexer) {
  bool has_content = false;
  while (lexer->lookahead != 0) {
    if (lexer->lookahead == '{') {
      lexer->mark_end(lexer);
      advance(lexer);
      if (lexer->lookahead == '{') {
        advance(lexer);
        if (lexer->lookahead == '{') {
          advance(lexer);
          if (lexer->lookahead == '{') {
            advance(lexer);
            if (lexer->lookahead == '/') {
              lexer->result_symbol = RAW_BLOCK_CONTENT;
              return has_content;
            }
            has_content = true;
          } else {
            has_content = true;
          }
        } else {
          has_content = true;
        }
      } else {
        has_content = true;
      }
    } else {
      has_content = true;
      advance(lexer);
    }
  }
  return false;
}

bool tree_sitter_handlebars_external_scanner_scan(void *payload,
                                                  TSLexer *lexer,
                                                  const bool *valid_symbols) {
  if (valid_symbols[COMMENT_CONTENT]) {
    return scan_comment_content(lexer);
  }
  if (valid_symbols[RAW_BLOCK_CONTENT]) {
    return scan_raw_block_content(lexer);
  }
  return false;
}
