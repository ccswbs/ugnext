export function isDraft(context) {
  return Boolean(process?.env?.NODE_ENV !== "production" || context?.draftMode || context?.preview);
}
