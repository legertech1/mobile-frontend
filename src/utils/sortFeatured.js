export default function sortFeatured(arr) {
  return arr.sort((a, b) => {
    if (a?.meta.featured && !b?.meta.featured) {
      return -1;
    } else if (!a?.meta.featured && b?.meta.featured) {
      return 1;
    } else {
      return 0;
    }
  });
}
