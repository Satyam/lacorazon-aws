import { db } from 'Firebase';

export const configs: ConfigType = {
  PVP: 12,
  comisionEstandar: 0.35,
  IVALibros: 0.04,
  comisionInterna: 0.25,
};

type Keys = keyof ConfigType;

db.ref('config').on('value', (snap) => {
  const values: ConfigType = snap.val();
  Object.keys(values).forEach((key) => {
    configs[key as Keys] = values[key as Keys];
  });
});

export default configs;
