export const cleanUrl = (rawLink: string) => {
  if (rawLink.indexOf("://") !== -1 || rawLink.length === 0) {
    return rawLink;
  }
  return `http://${rawLink}`;
};
