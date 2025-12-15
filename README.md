# UGNext

## Package Manager

UGNext uses bun as its runtime/package manager.

To get started:

1. Install bun https://bun.sh/docs/installation
2. Ensure you have a .env file with the appropriate environment variables set
   
   ```
   DRUPAL_CLIENT_ID
   DRUPAL_CLIENT_SECRET
   DRUPAL_PREVIEW_SECRET
   DRUPAL_REVALIDATE_SECRET
   FONTAWESOME_PACKAGE_TOKEN
   NEXT_PUBLIC_DRUPAL_BASE_URL
   NEXT_PUBLIC_GTM_ID
   NEXT_PUBLIC_GTM_ID_DEV
   DRUPAL_API_KEY
   ```
   
3. Run `bun install` in your terminal
4. Start the codegen script in watch mode using `bun run codegen:watch`
5. In another terminal, start the development server using `bun run dev`
   
   Note: by default, the dev server will show unpublished content from Drupal, if you wish to see how a page will look on production, set the enviroment variable `ALWAYS_SHOW_PUBLISHED` to true
6. Once you have both the codegen and server running, you're ready to develop!

## Regenerating Playwright Snapshots

ugnext uses playwright to generate visual regression snapshots. Sometimes these snapshots need to be regenerated when the underlying markup changes.

As the playwright tests are ran in an AzureDevOps pipeline, the snapshots must be generated using a Linux environment.

If you are using a Linux machine, then simply run `bun run update-snapshots:host`.

If you are using a Mac or Windows machine, you will first need to download Docker Desktop, then run the following command: `bun run update-snapshots:docker`. 