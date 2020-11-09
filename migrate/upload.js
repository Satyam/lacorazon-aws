const admin = require('firebase-admin');

const serviceAccount = require('./lacorazon-d66fd-firebase-adminsdk-thy14-92e97d72c9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lacorazon-d66fd.firebaseio.com'
});

const db = admin.database();

const data = require('./La Corazon.json');

function addVendedores() {
  console.log('vendedores');
  return db.ref('vendedores').set({
    ro: {
      nombre: 'Roxana Cabut',
      email: 'RoxanaCabut@gmail.com'
    },
    ra:{
      nombre: 'Raed El Younsi',
      email: 'reyezuelo@gmail.com'
    },
    rora:{
      nombre: 'Roxana & Raed',
      email: 'reyezuelo@gmail.com;RoxanaCabut@gmail.com'
    }
  })
}

function addConfig() {
  console.log('config');
  return db.ref('config').set({
    PVP:	12,
    comisionEstandar:0.35,
    IVALibros:0.04,
    comisionInterna:0.25,
})
}

function addDistribuidores() {
  console.log('distribuidores')
  const campos = [
    'nombre',
    'localidad',
    'contacto',
    'telefono',
    'email',
    'direccion',
    'nif'
  ];
  return db.ref('distribuidores').set(
    data.puntosDeVenta.reduce((distribuidores, {codigo, ...distribuidor}) => ({
      ...distribuidores,
      [codigo.toLowerCase()]: campos.reduce((acc, campo) => distribuidor[campo] 
        ? ({
          ...acc,
          [campo]:distribuidor[campo]
        })
        : acc, {})
    }), {})
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
  console.log('venta directa')
  const ventas = db.ref('ventas');
  return Promise.all(
    data.ventaDirecta.sort(byFecha).map(({vendedor, ...venta}) =>
      ventas.push({
        ...venta,
        idVendedor: vendedor ? vendedor.toLowerCase() : null
      })
    )
  );
}

function addEnConsigna() {
  console.log('en consigna')
  const consigna = db.ref('consigna');
  return Promise.all(
    data.enConsigna.sort(byFecha).map(({ codigo, vendedor, ...venta }) =>
      consigna.push({
        ...venta,
        idVendedor: vendedor ? vendedor.toLowerCase() : null,
        idDistribuidor: codigo.toLowerCase()
      })
    )
  );
}

function addSalidas() {
  console.log('salidas')
  const salidas = db.ref('salidas');
  return Promise.all(
    data.salidas.sort(byFecha).map(({comision, ...salida}) =>
      salidas.push(
        comision 
        ? {
          ...salida,
          idVendedor:comision.toLowerCase()
        }
        : salida
      )
  ));
}

db.ref().set({
  config: null,
  vendedores: null,
  distribuidores: null,
  consigna: null,
  salidas: null
})
  .then(addConfig)
  .then(addVendedores)
  .then(addDistribuidores)
  .then(addVentaDirecta)
  .then(addEnConsigna)
  .then(addSalidas)
  .then(() => process.exit());
