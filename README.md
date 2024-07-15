# UGNext

UGNext uses bun as its runtime/package manager.

To get started:

1. Install bun https://bun.sh/docs/installation
2. Ensure you have a .env file with the appropriate environment variables set
3. Run `bun install` in your terminal
4. Start the development server using `bun run dev`

## SQLite

UGNext uses SQLite to embedded a database that is used to build some pages.

Typically, Git does not handle SQLite's binary database file very well. To address this we have set up a git filter which allows us to track changes made to the database. If you have cloned the repo and are seeing an error about a missing filter, you will need to run the following to fix it:

```bash 
git config --local include.path ../.gitconfig
git stash save -u
rm .git/index
git checkout HEAD -- "$(git rev-parse --show-toplevel)"
git stash pop
```