export default function (email) {
  if (
    !email.includes("@") ||
    !email.includes(".") ||
    !email.split("@")[0].length ||
    !email.split("@")[1].length ||
    !email.split(".")[0].length ||
    !email.split(".")[1].length
  )
    return false;

  return true;
}
