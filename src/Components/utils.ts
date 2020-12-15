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
