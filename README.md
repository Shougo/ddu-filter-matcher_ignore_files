# ddu-filter-matcher_ignore_files

Ignore files matcher for ddu.vim

This matcher filters ignored files.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddu.vim

https://github.com/Shougo/ddu.vim

## Configuration

```vim
call ddu#custom#patch_global(#{
    \   sourceOptions: #{
    \     _: #{
    \       matchers: ['matcher_ignore_files'],
    \     },
    \   }
    \ })

call ddu#custom#patch_global(#{
    \   filterParams: #{
    \     matcher_ignore_files #{
    \       ignoreGlobs: ['test_*.vim'],
    \       ignorePatterns: ['/test_[^/]*.vim$'],
    \     },
    \   }
    \ })
```
