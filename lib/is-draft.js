export function isDraft(context) {
  const { preview, draftMode } = context;
  const dev = process.env.NODE_ENV !== "production";

  return dev || draftMode || preview;
}
