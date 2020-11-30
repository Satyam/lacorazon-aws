const TEST = false;

let db;
let auth;
if (TEST) {
  db = {
    ref: (path) => ({
      set: (val) => Promise.resolve(console.log('set', path, val)),
      push: (val) => Promise.resolve(console.log('push', path, val)),
    }),
  };
  auth = {
    setCustomUserClaims: (uid, claim) =>
      Promise.resolve(console.log('claim for', uid, claim)),
  };
} else {
  const admin = require('firebase-admin');

  const serviceAccount = require('./lacorazon-d66fd-firebase-adminsdk-thy14-92e97d72c9.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lacorazon-d66fd.firebaseio.com',
  });
  db = admin.database();
  auth = admin.auth();
}

const data = require('./La Corazon.json');

function filterEmpty(obj) {
  return Object.keys(obj).reduce((out, k) => {
    const val = obj[k];
    return typeof val === 'undefined' || val === null || val === ''
      ? out
      : {
          ...out,
          [k]: val,
        };
  }, {});
}

function addClaims() {
  console.log('auth claims');
  return Promise.all([
    auth.setCustomUserClaims('7VQcpiofBaeVjvw79nat55QThwC2', {
      admin: true,
      operador: true,
    }),
    // 'roxanacabut@gmail.com': {
    //   role: 'operador'
    // },
    // 'reyezuelo@gmail.com': {
    //   role: 'operador'
    // }
  ]);
}

function addVendedores() {
  console.log('vendedores');
  return db.ref('vendedores').set({
    ro: {
      nombre: 'Roxana Cabut',
      email: 'RoxanaCabut@gmail.com',
    },
    ra: {
      nombre: 'Raed El Younsi',
      email: 'reyezuelo@gmail.com',
    },
    rora: {
      nombre: 'Roxana & Raed',
      email: 'reyezuelo@gmail.com;RoxanaCabut@gmail.com',
    },
  });
}

// function addUsers() {
//   console.log('users');
//   return db.ref('users').set({
//     '7VQcpiofBaeVjvw79nat55QThwC2': {
//       role: 'admin',
//     },
//     // 'roxanacabut@gmail.com': {
//     //   role: 'operador'
//     // },
//     // 'reyezuelo@gmail.com': {
//     //   role: 'operador'
//     // }
//   });
// }

const PVP = 12;
const comisionEstandar = 0.35;
const PrecioDescontado = 10;
function addConfig() {
  console.log('config');
  return db.ref('config').set({
    PVP,
    comisionEstandar,
    PrecioDescontado,
    IVALibros: 0.04,
    comisionInterna: 0.25,
    IVAs: [0, 0.04, 0.1, 0.21],
  });
}

function addDistribuidores() {
  console.log('distribuidores');
  const campos = [
    'nombre',
    'localidad',
    'contacto',
    'telefono',
    'email',
    'direccion',
    'nif',
  ];
  return db.ref('distribuidores').set(
    data.puntosDeVenta.reduce(
      (distribuidores, { codigo, ...distribuidor }) => ({
        ...distribuidores,
        [codigo.toLowerCase()]: campos.reduce(
          (acc, campo) =>
            distribuidor[campo]
              ? {
                  ...acc,
                  [campo]: distribuidor[campo],
                }
              : acc,
          {}
        ),
      }),
      {}
    )
  );
}

function byFecha(a, b) {
  const fa = a.fecha;
  const fb = b.fecha;
  if (fa < fb) return -1;
  if (fa > fb) return 1;
  return 0;
}

function addVentaDirecta() {
  console.log('venta directa');
  const ventas = db.ref('ventas');
  ventas.set(null);
  return Promise.all(
    data.ventaDirecta.sort(byFecha).map(({ vendedor, ctaRaed, ...venta }) =>
      ventas.push({
        ...venta,
        idVendedor: vendedor ? vendedor.toLowerCase() : null,
        cuenta: ctaRaed ? 'ctaRaed' : 'efvoRoxy',
      })
    )
  );
}

function addEnConsigna() {
  console.log('en consigna');
  const consigna = db.ref('consigna');
  consigna.set(null);
  const facturas = db.ref('facturas');
  facturas.set(null);
  const porcentajes = {};
  return Promise.all(
    data.enConsigna
      .sort(byFecha)
      .map(
        ({
          fecha,
          codigo,
          vendedor,
          ctaRaed,
          entregados,
          vendidos,
          devueltos,
          facturado,
          nroFactura,
          porcentaje,
          cobrado,
          comentarios,
        }) => {
          if (TEST)
            console.log('-------------------', {
              fecha,
              codigo,
              vendedor,
              ctaRaed,
              entregados,
              vendidos,
              devueltos,
              facturado,
              nroFactura,
              porcentaje,
              cobrado,
              comentarios,
            });
          const idDistribuidor = codigo.toLowerCase();
          const concepto = comentarios;
          if (porcentaje) {
            /* Ignorar SOLO el porcentaje en los siguientes registros:

    {
      "codigo": "Beatriz",
      "fecha": "2018-11-01T23:00:00.000Z",
      "vendedor": "Ro",
      "entregados": 10,
      "porcentaje": 0.1666
    },

        {
      "codigo": "Carla Penna",
      "fecha": "2019-03-19T23:00:00.000Z",
      "vendedor": "Ro",
      "entregados": 4,
      "porcentaje": 0.17
    },
          */
            if (
              !(
                (codigo === 'Beatriz' &&
                  fecha === '2018-11-01T23:00:00.000Z') ||
                (codigo === 'Carla Penna' &&
                  fecha === '2019-03-19T23:00:00.000Z')
              )
            )
              porcentajes[idDistribuidor] = porcentaje;
          }
          const pct = porcentajes[idDistribuidor];
          return Promise.all([
            entregados &&
              consigna.push(
                filterEmpty({
                  idDistribuidor,
                  fecha,
                  concepto,
                  movimiento: 'entregados',
                  cantidad: entregados,
                })
              ),
            vendidos &&
              consigna.push(
                filterEmpty({
                  idDistribuidor,
                  fecha,
                  concepto,
                  movimiento: 'vendidos',
                  cantidad: vendidos,
                })
              ),
            devueltos &&
              consigna.push(
                filterEmpty({
                  idDistribuidor,
                  fecha,
                  concepto,
                  movimiento: 'devueltos',
                  cantidad: devueltos,
                })
              ),
            facturado &&
              consigna.push(
                filterEmpty({
                  idDistribuidor,
                  fecha,
                  concepto,
                  movimiento: 'facturados',
                  cantidad: Math.round(
                    pct
                      ? facturado / (1 - pct) / PVP
                      : facturado / PrecioDescontado
                  ),
                })
              ),

            (porcentaje || facturado || cobrado) &&
              facturas.push(
                filterEmpty({
                  idDistribuidor,
                  fecha,
                  concepto,
                  idVendedor: vendedor ? vendedor.toLowerCase() : null,
                  porcentaje: pct,
                  // ||   comisionEstandar,
                  nroFactura,
                  facturado,
                  cobrado,
                  cuenta: ctaRaed ? 'ctaRaed' : 'efvoRoxy',
                })
              ),
          ]);
        }
      )
  );
}

function addSalidas() {
  console.log('salidas');
  const gastos = db.ref('gastos');
  gastos.set(null);
  const reintegros = db.ref('reintegros');
  reintegros.set(null);
  const comisiones = db.ref('comisiones');
  comisiones.set(null);
  const pagosIva = db.ref('pagosIva');
  pagosIva.set(null);
  return Promise.all(
    data.salidas
      .sort(byFecha)
      .map(({ comision, ctaRaed, reintegro, pagoiva, iva, ...salida }) => {
        const cuenta = ctaRaed ? 'ctaRaed' : 'efvoRoxy';
        if ((reintegro && 1) + (pagoiva && 1) + (comision && 1) > 1) {
          console.error('demasiadas operaciones', {
            comision,
            ctaRaed,
            reintegro,
            pagoiva,
            iva,
            ...salida,
          });
        }
        if (reintegro)
          return reintegros.push({
            ...salida,
            cuenta,
          });
        if (pagoiva)
          return pagosIva.push({
            ...salida,
            cuenta,
          });
        if (comision)
          return comisiones.push({
            ...salida,
            idVendedor: comision ? comision.toLowerCase() : null,
          });
        return gastos.push({
          ...salida,
          iva: iva || 0,
          cuenta,
        });
      })
  );
}

addClaims()
  .then(addVendedores)
  .then(addConfig)
  .then(addDistribuidores)
  .then(addVentaDirecta)
  .then(addEnConsigna)
  .then(addSalidas)
  .then(() => process.exit());
