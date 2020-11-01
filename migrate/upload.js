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
      idVendedor: 'ro',
      nombre: 'Roxana Cabut',
      email: 'RoxanaCabut@gmail.com'
    },
    ra:{
      idVendedor: 'ra',
      nombre: 'Raed El Younsi',
      email: 'reyezuelo@gmail.com'
    },
    rora:{
      idVendedor: 'rora',
      nombre: 'Roxana & Raed',
      email: 'reyezuelo@gmail.com;RoxanaCabut@gmail.com'
    }
  })
}

function addDistribuidores() {
  console.log('distribuidores')
  const campos = [
    'codigo',
    'nombre',
    'localidad',
    'contacto',
    'telefono',
    'email',
    'direccion'
  ];
  return db.ref('distribuidores').set(
    data.puntosDeVenta.reduce((distribuidores, distribuidor) => ({
      ...distribuidores,
      [distribuidor.codigo.toLowerCase()]: campos.reduce((acc, campo) => {
        if (campo === 'codigo') acc.idDistribuidor = distribuidor.codigo.toLowerCase();
        else if (distribuidor[campo]) acc[campo] = distribuidor[campo];
        return acc;
      }, {})
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
    data.salidas.sort(byFecha).map(salida =>
      salidas.push(salida)
    )
  );
}

db.ref().set({
  vendedores: null,
  distribuidores: null,
  consigna: null,
  salidas: null
})
  .then(addVendedores)
  .then(addDistribuidores)
  .then(addVentaDirecta)
  .then(addEnConsigna)
  .then(addSalidas)
  .then(() => process.exit());
