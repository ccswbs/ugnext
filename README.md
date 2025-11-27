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

## AI-Enhanced Search with Orama Cloud

This project includes AI-enhanced vector search functionality powered by Orama Cloud for faculty research area searches.

### Setup Orama Cloud

1. **Create an Orama Cloud account** at [https://cloud.oramasearch.com/](https://cloud.oramasearch.com/)

2. **Create a new project** in your Orama Cloud dashboard

3. **Get your API credentials**:
   - Navigate to your project settings
   - Copy your API key and endpoint URL

4. **Add environment variables** to your `.env.local` file:
   ```
   ORAMA_PROJECT_ID=your-orama-project-id
   ORAMA_API_KEY=your-orama-api-key
   ```

### How Vector Search Works

The faculty search page now includes an **AI-Enhanced Search** toggle that allows users to switch between:

- **Regular Search**: Traditional text-based search that matches exact terms
- **AI-Enhanced Search**: Vector search that understands semantic meaning and context

When AI-Enhanced Search is enabled:
- Research area searches use vector embeddings for semantic matching
- Users can find relevant faculty even when using different terminology
- The search understands related concepts and synonyms
- Results include relevance scores for better ranking

### Vector Search Features

- **Semantic Understanding**: Finds faculty based on conceptual similarity rather than just keyword matching
- **Fallback Support**: Gracefully falls back to regular search if Orama Cloud is unavailable
- **Real-time Toggle**: Users can switch between search modes without page refresh
- **Combined Filtering**: Vector search respects all other filters (unit, name, etc.)

### Configuration Requirements

For vector search to work properly, you need:

1. Valid Orama Cloud API credentials in your environment variables
2. Your faculty profile data indexed in Orama Cloud with research areas
3. Vector embeddings configured for the research areas field

### Troubleshooting

If vector search is not working:

1. **Check environment variables**: Ensure `ORAMA_PROJECT_ID` and `ORAMA_API_KEY` are set
2. **Verify credentials**: Test your API key in the Orama Cloud dashboard
3. **Check data indexing**: Ensure your faculty profiles are properly indexed in Orama Cloud
4. **Monitor console logs**: Check browser/server console for error messages

The application will gracefully fall back to regular search if there are any issues with the vector search configuration.

