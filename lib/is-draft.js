export function isDraft(context) {
  if (!context) {
    return false;
  }

  return Boolean(process?.env?.NODE_ENV !== "production" || context?.draftMode || context?.preview);
}
