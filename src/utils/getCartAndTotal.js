export default function (pricing, user, category, ignoreFree = false) {
  console.log(pricing, user, category);
  let total = 0;
  let cart = {};

  cart.category = category.name;
  if (
    !ignoreFree &&
    (user?.data?.postedAds[category.name]?.free || 0) <
      category.pricing[pricing.package.name].freeAds
  ) {
    total += 0;
    cart.package = {
      name: pricing.package.name,
      item: category.pricing[pricing.package.name],
      free: true,
    };
  } else {
    total += category.pricing[pricing.package.name].price || 0;
    cart.package = {
      name: pricing.package.name,
      item: category.pricing[pricing.package.name],
    };
  }

  if (pricing.addOns) {
    for (let addOn of Object.keys(pricing.addOns)) {
      if (!pricing.addOns[addOn] || !category.pricing.AddOns[addOn]) continue;

      let item = category.pricing.AddOns[addOn].filter((i) => {
        if (
          i.price == pricing.addOns[addOn].price &&
          ((i.days && i.days == pricing.addOns[addOn].days) ||
            (i.frequency && i.frequency == pricing.addOns[addOn].frequency))
        )
          return true;
        else return false;
      })[0];

      cart.addOns = {
        ...cart.addOns,
        [addOn]: item ? item : { days: 0, frequency: 0, price: 0 },
      };
      total += item?.price || 0;
    }
  }
  if (pricing.extras) {
    for (let extra of Object.keys(pricing.extras)) {
      if (!pricing.extras[extra]) continue;

      total += category.pricing.Extras[extra]?.price || 0;
      cart.extras = {
        ...cart.extras,
        [extra]: {
          ...category.pricing.Extras[extra],
          url: pricing?.extras[extra]?.url,
        },
      };
    }
  }

  return [total.toFixed(2), cart];
}
