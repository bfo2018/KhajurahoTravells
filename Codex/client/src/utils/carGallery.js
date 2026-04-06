export function getCarGallery(car) {
  if (!car) return [];
  return car.images || [];
}
