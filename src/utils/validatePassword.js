export default function (password) {
  var filter =
    /^(?=.*\d)(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;
  if (!password.match(filter)) return false;
  return true;
}
