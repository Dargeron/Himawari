// Placeholder notebook with the final interface; replaced by the full
// notebook (pocket, diary, board, pages, album, settings, credits).
export function createNotebook(root, api) {
  let open = false;
  return {
    open(tab = 'diary') {
      open = true;
      root.hidden = false;
      root.dataset.tab = tab;
      api.onOpen?.();
    },
    close() {
      if (!open) return;
      open = false;
      root.hidden = true;
      api.onClose?.();
    },
    isOpen: () => open,
    refresh() {},
  };
}
