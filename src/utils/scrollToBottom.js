export default function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth", // Optional: use 'auto' for instant scrolling
  });
}
