export default function (e, obj = { dur: 3 }) {
  let btn = e.currentTarget;
  // Listen for click event

  // Create span element
  let ripple = document.createElement("span");

  // Add ripple class to span
  ripple.classList.add(obj.fast ? "ripple_fast" : "ripple");

  // Add span to the button
  btn.appendChild(ripple);

  // Get position of X
  let x =
    e.clientX -
    // window.scrollX +
    // e.currentTarget.parentNode.scrollLeft -
    e.currentTarget.getBoundingClientRect().x;

  // Get position of Y
  let y =
    e.clientY -
    // window.scrollY +
    // e.currentTarget.parentNode.scrollTop -
    e.currentTarget.getBoundingClientRect().y;

  // Position the span element
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  // Remove span after 0.3s
  setTimeout(() => {
    ripple.remove();
    obj.cb && setTimeout(() => obj.cb(), 10);
  }, obj.dur * 100);
}
