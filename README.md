# tree-sitter-handlebars

[![CI][ci]](https://github.com/bennypowers/tree-sitter-handlebars/actions/workflows/ci.yml)
[![npm][npm]](https://www.npmjs.com/package/tree-sitter-handlebars)
[![crates][crates]](https://crates.io/crates/tree-sitter-handlebars)
[![pypi][pypi]](https://pypi.org/project/tree-sitter-handlebars)

[Handlebars](https://handlebarsjs.com/) template grammar for
[tree-sitter](https://github.com/tree-sitter/tree-sitter).

Exposes a named `text` node for all HTML/non-template content between Handlebars
constructs, suitable for secondary HTML parsing in LSP tooling.

## References

- [Handlebars Language Guide](https://handlebarsjs.com/guide/)
- [Handlebars Expressions Spec](https://handlebarsjs.com/guide/expressions.html)

[ci]: https://img.shields.io/github/actions/workflow/status/bennypowers/tree-sitter-handlebars/ci.yml?logo=github&label=CI
[npm]: https://img.shields.io/npm/v/tree-sitter-handlebars?logo=npm
[crates]: https://img.shields.io/crates/v/tree-sitter-handlebars?logo=rust
[pypi]: https://img.shields.io/pypi/v/tree-sitter-handlebars?logo=pypi&logoColor=ffd242
