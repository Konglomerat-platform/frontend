export function scrollChatToEnd(node: HTMLElement | null) {
  if (!node) return;
  node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
}
