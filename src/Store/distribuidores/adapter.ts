import { createEntityAdapter } from '@reduxjs/toolkit';

export default createEntityAdapter<DistribuidorType>({
  selectId: (distribuidor) => distribuidor.idDistribuidor,
  sortComparer: (a, b) => a.nombre.localeCompare(b.nombre),
});
