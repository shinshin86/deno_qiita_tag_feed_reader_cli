# deno_qiita_tag_feed_reader_cli

It is a tool for retrieving posts from [Qiita](https://qiita.com/) that are tied
to a specific tag in the CLI.

I try a rewrote
[this tool](https://github.com/shinshin86/qiita-tag-feed-reader-cli) in
[Deno](https://deno.land/).

## Usage

```sh
# A tag will be selected at random
deno run --allow-net app.ts

# specify tag (ex: deno)
deno run --allow-net app.ts deno

# help
deno run app.ts help # (or --help or -h)
```

## Note

When running without arguments, there are 100 tags that can be selected at
random, in order of frequency of use. However, these tags were obtained in
advance using Qiita's API at the time of implementation, So they do not reflect
the latest state at runtime.
