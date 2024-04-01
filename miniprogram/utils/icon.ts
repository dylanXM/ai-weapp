export const icons = [
  'location-o',
  'like-o',
  'star-o',
  'fire-o',
  'coupon-o',
  'gem-o',
  'award-o',
  'diamond-o',
  'medal-o',
  'flag-o',
];

export const colors = [
  '#91ED61',
  '#FFBE00',
  '#EA6853',
  '#F76260',
  '#D84E43',
  '#2782D7',
  '#10AEFF',
  '#1AAD19',
  '#2BA245',
];

export const getRandom = (list: string[]) => {
  const len = list.length;
  const randomIndex = Math.floor(Math.random() * len);
  return list[randomIndex];
}