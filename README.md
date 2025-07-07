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
   
   The ```ALWAYS_SHOW_PUBLISHED``` variable can be used to force to show published content in your dev server
   
   
3. Run `bun install` in your terminal
4. Start the codegen script in watch mode using ```bun run codegen:watch```
5. Start the development server using `bun run dev`

