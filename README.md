# UGNext

## Package Manager

UGNext uses bun as its runtime/package manager.

To get started:

1. Install bun https://bun.sh/docs/installation
2. Ensure you have a .env file with the appropriate environment variables set
3. Run `bun install` in your terminal
4. Start the development server using `bun run dev`

## SQLite

UGNext uses SQLite to embedded a database in a local file that is used to build some pages; as a result you must have
sqlite3 installed on your machine.

### Handling changes with Git and backing up the database

Typically, Git does not handle SQLite's binary database file very well. To address this we need some way to view changes
to the database in a textual format.

SQLite has a feature that can help us with this, the dump command allows us to create a SQL script file which can be
used to recreate our database exactly. As this dump file is just text, it means that Git is able to handle it just like
any other file.

Whenever we make changes to the database, we create a dump file (located at /data/sqlite/dump.sql), which can be used to
recreate the database. As this dump file is a text file rather than a binary, git is able to keep track of changes made
to the database with it.

We can create this dump file easily using the following command:

```bash
bun run backup-db
```

**IMPORTANT** This command must be run whenever you make changes to the database, otherwise those changes will be lost
whenever the database is restored.

### Restoring the database

As stated previously, the dump file that is created (as described previously), allows us to recreate the database with
it. We can do this with the following command:

```bash
bun run restore-db
```

Note, this command is automatically run whenever the dev server is started, or the project is built.
Despite this it is still recommended
that you run this command manually whenever you merge any changes that have updated the dump file.
