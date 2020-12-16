type RecordWithFecha = {
  fecha: Date;
} & Record<string, any>;

export const byFecha = (a: RecordWithFecha, b: RecordWithFecha) => {
  const af = a.fecha.getTime();
  const bf = b.fecha.getTime();
  if (af < bf) return -1;
  if (af > bf) return 1;
  return 0;
};

export const byField = (name: string) => (
  a: Record<string, any>,
  b: Record<string, any>
) => {
  const af = a[name];
  const bf = b[name];
  if (af < bf) return -1;
  if (af > bf) return 1;
  return 0;
};

export const yearTabs = (
  list: { fecha: Date }[],
  year: string
): [number[], number] => {
  const l = list.length;
  const years = [];
  let maxYear = new Date().getFullYear();
  if (l) {
    const minYear = list[0].fecha.getFullYear();
    maxYear = list[l - 1].fecha.getFullYear();
    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }
  }
  const activeYear: number = year ? parseInt(year, 10) : maxYear;
  return [years, activeYear];
};
