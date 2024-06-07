import adPlaceholder from "../assets/images/imagePlaceholder.jpg";

export const randomKey = () => {
  return Math.random().toString(36).substring(7);
};

export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const imagesToBase64 = async (images) => {
  let base64Images = [];
  for (let i = 0; i < images.length; i++) {
    let base64 = await toBase64(images[i].file);
    base64Images.push({
      data: base64,
    });
  }

  return base64Images;
};

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateLongText = () =>
  Array.from({ length: 2000 }, () => "Lorem ipsum dolor sit amet").join(" ");

export const dateFormatter = (date) => {
  if (!date) return "";
  const d = new Date(date);

  const year = d.getFullYear();

  const month = d.getMonth() + 1;

  const day = d.getDate();

  return `${month}/${day}/${year}`;
};

export const extractAddressComponents = (item) => {
  const { address_components } = item;
  let sublocalityLevel1 = null;
  let locality = null;
  let administrativeAreaLevel1 = null;

  for (const component of address_components) {
    const types = component.types;
    const longName = component.long_name;

    if (types.includes("neighborhood")) {
      sublocalityLevel1 = longName;
    } else if (types.includes("locality")) {
      locality = longName;
    } else if (types.includes("administrative_area_level_1")) {
      administrativeAreaLevel1 = longName;
    }
  }

  let address = "";
  if (sublocalityLevel1) address += `${sublocalityLevel1}, `;
  if (locality) address += `${locality}, `;
  if (administrativeAreaLevel1) address += `${administrativeAreaLevel1}`;

  return address;
};

export function removeDuplicates(array, key) {
  return array.reduce((arr, item) => {
    const removed = arr.filter((i) => i[key] !== item[key]);
    return [...removed, item];
  }, []);
}

export const adPlaceholderImg = adPlaceholder;

export const handleImgError = (e) => {
  e.target.src = adPlaceholderImg;
};

export function parseTime(time) {
  let ms = new Date(time).getTime();
  let now = new Date().getTime();
  const diff = now - ms;

  if (diff < 60000) return "Just now";
  else if (diff > 60000 && diff < 3600000)
    return (
      Math.floor(diff / 60000) +
      (Math.floor(diff / 60000) > 1 ? " minutes" : " minute")
    );
  else if (diff > 3600000 && diff < 24 * 3600000)
    return (
      Math.floor(diff / 3600000) +
      (Math.floor(diff / 3600000) > 1 ? " hours" : " hour")
    );
  else if (diff > 24 * 3600000 && diff < 24 * 3600000 * 7)
    return (
      Math.floor(diff / (24 * 3600000)) +
      (Math.floor(diff / (24 * 3600000)) > 1 ? " days" : " day")
    );
  else if (diff > 24 * 3600000 * 7)
    return (
      Math.floor(diff / (24 * 3600000 * 7)) +
      (Math.floor(diff / (24 * 3600000 * 7)) > 1 ? " weeks" : " week")
    );
}
