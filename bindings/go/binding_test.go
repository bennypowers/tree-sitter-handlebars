package tree_sitter_handlebars_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_handlebars "bennypowers.dev/tree-sitter-handlebars/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_handlebars.Language())
	if language == nil {
		t.Errorf("Error loading Handlebars grammar")
	}
}
