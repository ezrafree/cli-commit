# commit

`commit` is a command-line convenience utility to add files to be tracked, format your commit message, and push your changes.

It gathers the parts of the conventional commit message, and then runs the `add`, `commit`, and `push` commands for you.

For example:

```sh
git add -v .
git commit -m 'feat(navarbar): implement search bar'
git push origin HEAD
```

## Install

### Prerequisites

To build this project you will need `pkg` installed globally:

```sh
npm install -g pkg
```

### Build

Run the following command to build `commit`:

```sh
yarn build
```

Then to install, copy the executable to someplace in your `$PATH`. For example:

```sh
cp commit /usr/local/bin
```

## Usage

To be prompted for your input, simply run the command with no arguments:

```sh
commit
```

Alternatively, you can provide your input via command-line arguments:

```sh
commit -t feat -s demo -d 'my commit message'
```

### Other Examples

If you only want to add specific files to the commit, you can use the `-na` flag:

```sh
git add foo.ts && commit -t feat -s demo -d 'my commit message' -na
```

If you want to `commit` but aren't ready to `push` just yet, you can use the `-np` flag:

```sh
commit -t feat -s demo -d 'my commit message' -np
```

### Options

#### `-t` or `--type`

You can use the `-t` option to specify the conventional commit type.

#### `-s` or `--scope`

You can use the `-s` option to specify the commit scope.

#### `-m` or `--message`

You can use the `-m` option to specify the commit description.

### Flags

#### `-na` or `--noadd`

You can use the `-a` flag to not run `git add`

#### `-np` or `--nopush`

You can use the `-p` flag to not run `git push`

#### `--debug`

You can use the `--debug` flag to not run any `git` commands and print debug info

#### `--version`

Print the version and exit.

## Development

To run the code during development without having to build first:

```sh
node bin/index.js
```
