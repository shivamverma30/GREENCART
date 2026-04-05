import banana_image_1 from "../assets/banana_image_1.png";
import tomato_image from "../assets/tomato_image.png";

const normalizeName = (name = "") => name.toLowerCase().trim();

const getNameFallback = (productName) => {
  const name = normalizeName(productName);

  if (name.includes("tomato")) return tomato_image;
  if (name.includes("banana")) return banana_image_1;

  return null;
};

const extractImageValue = (image) => {
  if (Array.isArray(image)) {
    for (const item of image) {
      const value = extractImageValue(item);
      if (value) return value;
    }
    return "";
  }

  if (typeof image === "string") {
    return image.trim();
  }

  if (image && typeof image === "object") {
    return (
      image.url?.trim() ||
      image.secure_url?.trim() ||
      image.path?.trim() ||
      image.src?.trim() ||
      ""
    );
  }

  return "";
};

const resolveImageUrl = (value) => {
  const src = String(value || "").trim();
  if (!src) return "";

  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) {
    return src;
  }

  const base = import.meta.env.VITE_API_URL || "";
  if (!base) return src;

  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = src.startsWith("/") ? src : `/${src}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const getProductImage = (product, fallbackImage) => {
  const candidate = extractImageValue(product?.image);

  if (candidate) {
    return resolveImageUrl(candidate);
  }

  return getNameFallback(product?.name) || fallbackImage;
};
