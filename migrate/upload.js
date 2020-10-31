const admin = require('firebase-admin');

const serviceAccount = require('./lacorazon-d66fd-firebase-adminsdk-thy14-92e97d72c9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lacorazon-d66fd.firebaseio.com'
});

const db = admin.database();

const data = require('./La Corazon.json');

function addVendedores() {
  return db.ref('vendedores').set({
    ro: {
      id: 'ro',
      nombre: 'Roxana Cabut',
      email: 'RoxanaCabut@gmail.com'
    },
    ra:{
      id: 'ra',
      nombre: 'Raed El Younsi',
      email: 'reyezuelo@gmail.com'
    },
    rora:{
      id: 'rora',
      nombre: 'Roxana & Raed',
      email: 'reyezuelo@gmail.com;RoxanaCabut@gmail.com'
    }
  })
}

function addDistribuidores() {
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
        if (campo === 'codigo') acc.id = distribuidor.codigo.toLowerCase();
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
  const ventas = db.ref('ventas');
  return Promise.all(
    data.ventaDirecta.sort(byFecha).map(venta =>
      ventas.push({
        ...venta,
        fecha: new Date(venta.fecha),
        vendedor: venta.vendedor ? venta.vendedor.toLowerCase() : null
      })
    )
  );
}

// function sortByCodigoFecha(a, b) {
//   const ca = a.codigo;
//   const cb = b.codigo;
//   if (ca < cb) return -1;
//   if (ca > cb) return 1;
//   return byFecha(a,b);
// }
function addEnConsigna() {
  const consigna = db.ref('consigna');
  return Promise.all(
    data.enConsigna.sort(byFecha).map(({ codigo, ...venta }) =>
      consigna.push({
        ...venta,
        fecha: new Date(venta.fecha),
        vendedor: venta.vendedor ? venta.vendedor.toLowerCase() : null,
        distribuidor: codigo.toLowerCase()
      })
    )
  );
}

function addSalidas() {
  const salidas = db.ref('salidas');
  return Promise.all(
    data.salidas.sort(byFecha).map(salida =>
      salidas.push({
        ...salida,
        fecha: new Date(salida.fecha)
      })
    )
  );
}

db.ref().remove()
  .then(addVendedores)
  .then(addDistribuidores)
  .then(addVentaDirecta)
  .then(addEnConsigna)
  .then(addSalidas);
