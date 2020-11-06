/* eslint-disable */
// @ts-nocheck
function makeHash(codigos, initialObj) {
  var acc = {};
  
  codigos.map(function (c) {
    return c[0].toLowerCase();
  }).filter(function (c) {
    return c.length;
  }).forEach(function (c) {
    var o = {};
    for (var k in initialObj) {
      o[k] = initialObj[k];
    }
    acc[c] = o
  });
  return acc;
};

function getRange(namedRange) {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getRangeByName(namedRange);
}
  
function getValues(namedRange) {
  return getRange(namedRange)
    .getValues();
}

function getValuesA1(range) {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getRange(range)
    .getValues();
}

function getTable(namedRange, mandatoryField) {
  var data = getValues(namedRange);
  var headers = data.shift();
  var iMandatory = headers.indexOf(mandatoryField);
  
  var reply = [];
  
  data.forEach(function (row) {
    if(row[iMandatory]) {
      var acc = {};
      headers.forEach(function (key, i) {
        acc[key] = row[i];
      });
      reply.push(acc);
    }
  });
  return reply;
}

function getTableA1(range, mandatoryField) {
  var data = getValuesA1(range);
  var headers = data.shift();
  var iMandatory = headers.indexOf(mandatoryField);
  
  var reply = [];
  
  data.forEach(function (row) {
    if(row[iMandatory]) {
      var acc = {};
      headers.forEach(function (key, i) {
        if (key) acc[key] = row[i];
      });
      reply.push(acc);
    }
  });
  return reply;
}

function getRow(namedRange) {
  return getValues(namedRange)[0];
}

function getValue(namedRange) {
  return getValues(namedRange)[0][0];
}


function clearContents(namedRange) {
  getRange(namedRange)
    .clearContent();
}

function setColorSchema(namedRange, text, background) {
  var range = getRange(namedRange)
    .setFontColor(text);
  if (background) range.setBackground(background);
}  

function invalidate(namedRanges) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Array.prototype.slice.call(arguments).forEach(function (name) {
    ss.getRangeByName(name)
      .setBackground('silver')
      .setFontColor('white');
  });
}
  
function invalidateToEnd(namedRanges) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Array.prototype.slice.call(arguments).forEach(function (name) {
    var range = ss.getRangeByName(name);
    var sheet = range
      .getSheet();
    sheet
      .getRange(range.getRow() + 1, range.getColumn(),sheet.getLastRow() - range.getRow(),range.getNumColumns())
      .setBackground('silver')
      .setFontColor('white');
  });
}

function writeValues(namedRange, values) {
  var range = getRange(namedRange);
  
  range
    .clearContent()
    .setBackground('lightpink')
    .setFontColor('black')
    .getSheet()
    .getRange(range.getRow(), range.getColumn(), values.length, values[0].length)
    .setValues(values);
}

function writeKeyedValues(keysRange, values) {
  var keys = getRow(keysRange);
  var result = values.map(function (row) {
    return keys.map(function (k) {
      var v = row[k];
      return (typeof v === 'undefined' ? '': v);
    });
  });
  var range = getRange(keysRange);
  var sheet = range.getSheet();
  sheet
    .getRange(range.getRow() + 1, range.getColumn(), sheet.getLastRow() - range.getRow(), keys.length)
    .clearContent();
 
  range
    .getSheet()
    .getRange(range.getRow() + 1, range.getColumn(), values.length, keys.length)
    .setBackground('lightpink')
    .setFontColor('black')
    .setValues(result);
}
var cache = {};

function clearCache() {
  cache = {};
}

function readVentaDirecta() {
  return cache.ventaDirecta || (cache.ventaDirecta = getTable('VentaDirecta', 'cantidad'));
}

function readEnConsigna() {
  return cache.enConsigna || (cache.enConsigna = getTable('EnConsigna', 'codigo'));
}

function readSalidas() {
  return cache.salidas || (cache.salidas = getTable('Salidas', 'importe'));
}

function log(values) {
  Logger.log(JSON.stringify(values));
};

function filterEmpties(data) {
  return data.map(function (row) {
    return Object.keys(row).filter( function (key) {
      return row[key];
    }).reduce(function (acc, key) {
      acc[key] = row[key];
      return acc;
    },{})
  });
};

function exportData() {
  log({
    ventaDirecta: filterEmpties(getTable('VentaDirecta', 'cantidad'))
  });
  log({
    enConsigna: filterEmpties(getTable('EnConsigna','codigo'))
  });
  log({
    salidas: filterEmpties(getTable('Salidas','importe'))
  });
  log({
    puntosDeVenta: filterEmpties(getTable('Puntos de Venta','codigo'))
  });
};

function exportToDrive() {
  const jsonBlob = Utilities.newBlob(
    JSON.stringify({
      ventaDirecta: filterEmpties(getTable('VentaDirecta', 'cantidad')),
      enConsigna: filterEmpties(getTable('EnConsigna','codigo')),
      salidas: filterEmpties(getTable('Salidas','importe')),
      puntosDeVenta: filterEmpties(getTable('PuntosDeVenta','codigo'))
    },null, 2), 
    'application/vnd.google-apps.script+json'
  );
  Drive.Files.insert(
    {
      title:'La Corazon.json',
      mimeType: 'application/json'
    }, 
    jsonBlob
  );
}

function refreshSumario() {
  
  var comisionesPagadasPorVendedor = readSalidas()
    .filter(function (row) { 
      return row.comision; 
    })
  .reduce(function (acumuladorComisionesPorVendedor, row) {
    var vendedor = row.comision.toLowerCase();
    acumuladorComisionesPorVendedor[vendedor] = (acumuladorComisionesPorVendedor[vendedor] || 0) + row.importe;
    return acumuladorComisionesPorVendedor;
  }, {})
  ;
    
  var porcComision = getValue('comisionInterna');
  
  var data = readVentaDirecta();
  
  var acc = {};
  
  data.forEach(function (row) {
    var n = row.vendedor;
    var v = n.toLowerCase();
    var p = Number(row.precioUnitario);
    var c = Number(row.cantidad);
    
    v = v || '??';
    
    var tot = acc[v];
    
    if (!tot) {
      tot = {
        name: n,
        vendido: 0,
        regalado: 0,
        total: 0,
        precio: 0,
        comisionVD: 0,
        comisionEC: 0,
        comisionPagada: comisionesPagadasPorVendedor[v] || 0
      }
      acc[v] = tot;
    }
    
    tot.total += c;
    if (p) {
      tot.vendido += c;
      tot.precio += c * p;
      tot.comisionVD += c * p * porcComision;
    } else {
      tot.regalado += c;
    }
  });

  for (v in acc) {
    var row = acc[v];
    if (row.vendido) {
      row.promedio = row.precio / row.vendido;
    }
  }
  
  readEnConsigna()
    .filter(function(row) {
      return (row.facturado > 0 && row.vendedor);
    })
    .forEach(function (row) {
      var v = row.vendedor.toLowerCase();
      acc[v].comisionEC += porcComision * Number(row.facturado);
    })
  
  writeValues("Sumario", Object.keys(acc).sort().map(function(k) {
    var row = acc[k];
    return [
      row.name, 
      row.vendido, 
      row.regalado, 
      row.total, 
      row.precio, 
      row.promedio, 
      k ==='rora' ? '': row.comisionVD, 
      k ==='rora' ? '': row.comisionEC, 
      k ==='rora' ? '': -row.comisionPagada, 
      k ==='rora' ? '': (row.comisionVD + row.comisionEC - row.comisionPagada)];
  }));
}

function refreshPuntosDeVenta() {
  var PVP = getValue('PVP');
  var comision = getValue('comision');
  var codigos = getValues('CodigosPuntosDeVenta');
  var columnas = getRow('columnasPuntosDeVenta');
  
 
  var acc = makeHash(
    codigos, 
    {
      entregados: 0,
      vendidos: 0,
      devueltos: 0,
      facturado: 0,
      aCobrar: 0,
      facturado: 0,
      porcentaje: 0,
      cobrado: 0
    }
  );
  
  var data = readEnConsigna();
                                        
  data.forEach(function (row) {
    var codigo = row.codigo.toLowerCase();
    if (!codigo) return;
    var tot = acc[codigo];
    if (!tot) throw new Error('Código de librería `' + row.codigo + '` desconocido');
    
    var entregados = Number(row.entregados);
    tot.entregados += entregados;
    
    var porcentaje = Number(row.porcentaje);
    if (porcentaje === 0) porcentaje = tot.porcentaje || comision;
    else tot.porcentaje = porcentaje;
    
    tot.vendidos += Number(row.vendidos);
    
    tot.devueltos += Number(row.devueltos);
    
    var facturado = Number(row.facturado);
    tot.facturado += facturado;

    tot.aCobrar = PVP * tot.vendidos * (1 - porcentaje) - facturado;
    tot.cobrado += Number(row.cobrado);
    
    tot.existencias = tot.entregados - tot.vendidos - tot.devueltos;
    
  });    
  
  
  var cant = Object.keys(acc).length;
  
  var reply = [];
  
  codigos.some(function (codigo) {
    codigo = codigo[0];
   
    if (!codigo) {
      reply.push([]);
    } else {
      var tot = acc[codigo.toLowerCase()];
    
      reply.push(columnas.map(function (columna) {
        return tot[columna] || '';
      }));
      cant--;
    }
                            
    return !cant;
  });
  
     
  writeValues('SumarioPuntosDeVenta', reply);
}

function acumVentaDirecta() {
  var data = readVentaDirecta();
  
  var factorPrecioSinIva = 1 + getValue('IVALibros');
  var acc = [];
  
  data.forEach(function (row) {
    var precio = Number(row.precioUnitario) * Number(row.cantidad);
    if (!precio) return;
    var precioSinIVA = row.iva ? precio / factorPrecioSinIva : precio;
    
    acc.push({
      fecha: row.fecha,
      origen: 'VD: ' + row.vendedor,
      concepto: row.concepto,
      importe: precio,
      ctaRaed: row.ctaRaed, 
      iva: (precio - precioSinIVA) || '',
      importeSinIVA: precioSinIVA
    });
  });
  return acc;
}

function acumSalidas() {
  
  var acc = [];

  var data = readSalidas();
  
  data.forEach( function (row) {
    var importe = Number(row.importe);
 
    var iva = Number(row.iva);
    var isReintegro = row.reintegro;
    var isPagoIVA = row.pagoiva;
    var comision = row.comision.toLowerCase();
 
    if (
      (iva ? 1 : 0) + 
      (isReintegro ? 1 : 0) + 
      (isPagoIVA ? 1 : 0) + 
      (comision ? 1 : 0) > 1) {
        throw new Error('En Salidas para la fecha ' + row.fecha.toDateString() + 
          ' no puede haber más de uno: IVA, Reintegro, Pago IVA o Comision en una misma entrada');
      }
    
   
    var importeSinIVA = importe / (1 + iva);
    acc.push({
      fecha: row.fecha,
      origen: (isReintegro ? 'Reintegro': ( isPagoIVA ? 'Pago IVA' : (comision ? 'Comisión ' + comision : 'Gasto'))),
      concepto: row.concepto,
      importe: -importe,
      ctaRaed: row.ctaRaed,
      iva: (isPagoIVA ? -importe : -(importe - importeSinIVA)  || ''),
      importeSinIVA: isPagoIVA ? 0: -importeSinIVA
    });
  });
  return acc;
 }

function acumConsigna() {
  var data = readEnConsigna();
  
  var acc = [];
  
  var factorPrecioSinIva = 1 + getValue('IVALibros');
  
  data.forEach(function (row) {
    var cobrado = Number(row.cobrado);
    if (!cobrado) return;
    
    var cobradoSinIVA = row.nroFactura ? cobrado / factorPrecioSinIva : cobrado;
    
    acc.push({
      fecha: row.fecha,
      origen: 'Dist: ' + row.vendedor,
      concepto: row.nroFactura ? row.nroFactura + ' de ' + row.codigo  : row.codigo,
      importe: cobrado,
      ctaRaed: row.ctaRaed,
      iva: (cobrado - cobradoSinIVA) || '',
      importeSinIVA: cobradoSinIVA
    });
  });
  return acc;
}


function refreshCaja() {
  
  var saldo = 0;
  var acumIVA = 0;
  var caja = 0;
  var ctaRaed = 0;
  
  var reply = acumSalidas().concat(acumVentaDirecta(), acumConsigna())
    .sort(function (a, b) { 
      return a.fecha - b.fecha;
    })
    .map(function (row) {
      saldo += row.importeSinIVA;
      acumIVA += row.iva || 0;
      if (row.ctaRaed) ctaRaed += row.importe || 0;
      else caja += row.importe || 0;
      row.saldo = saldo;
      row.acumIVA = acumIVA;
      return row;
    });
      
    
  writeKeyedValues('Caja', reply);
  writeValues('AcumCaja',[[saldo, acumIVA]]);
  writeValues('totalesPorCaja', [[ctaRaed + caja],[ctaRaed],[caja]]);
}

function refreshIngresos() {
  var data = readSalidas();
  
  var reintegros = 0;
  var comisiones = {
    ro: 0,
    ra: 0
  }
  
  data.forEach(function (row) {
    if (row.reintegro) {
      reintegros += row.importe;
    }
    if (row.comision) {
      comisiones[row.comision.toLowerCase()] += row.importe;
    }
  });
  writeValues('Ingresos', [
    [reintegros / 2, comisiones.ro, reintegros / 2 + comisiones.ro ],
    [reintegros / 2, comisiones.ra, reintegros / 2 + comisiones.ra],
    [reintegros, comisiones.ro + comisiones.ra, reintegros + comisiones.ro + comisiones.ra]
  ]);
}

function refreshFacturas() {
  var facts = {};
  readEnConsigna().filter(function(row) {
    return row.nroFactura
  }).forEach(function(row) {
    var fact = facts[row.nroFactura];
    if (!fact) {
      fact = {
        nroFactura: row.nroFactura
      };
      facts[row.nroFactura] = fact;
    }
    if (row.facturado) {
      if (fact.facturado && row.facturado !== -fact.facturado) {
        throw new Error('En Consigna de ' + row.codigo + ' del ' + row.fecha.toDateString() + 
          ' se repite una facturación con un número de factura ya usado');
      }
      fact.facturado = Number(row.facturado);
      fact.fechaFactura = row.fecha;
    }
    if (row.cobrado) {
      if (fact.cobrado) {
        throw new Error('En Consigna de ' + row.codigo + ' del ' + row.fecha.toDateString() + 
          ' se repite un cobro con un número de factura repetido');   
      }
      fact.cobrado = Number(row.cobrado);
      fact.fechaCobro = row.fecha;
      fact.ctaRaed = row.ctaRaed
    }
    if (fact.codigo) {
      if (fact.codigo !== row.codigo) {
        throw new Error('En Consigna de ' + row.codigo + ' del ' + row.fecha.toDateString() + 
          ' ese número de factura es de otro distribuidor');
      }
    } else {
      fact.codigo = row.codigo;
    }
  });
  
  writeKeyedValues('Facturas', Object.keys(facts).sort().map(function(nro) {
    return facts[nro];
  }))
}

function refresh() {
  SpreadsheetApp.getActiveSpreadsheet().toast("La hoja se está recalculando", "Paciencia ....", -1);
  clearCache();
  refreshCaja();
  refreshSumario();
  refreshPuntosDeVenta();
  refreshIngresos();
  refreshFacturas();
  SpreadsheetApp.getActiveSpreadsheet().toast("¡Hecho!", "fin", 1);
}

function onOpen() {
  refresh();
}

function onEdit() {
  invalidate("Sumario","SumarioPuntosDeVenta", 'AcumCaja', 'Ingresos', 'totalesPorCaja');
  invalidateToEnd( 'Facturas', 'Caja')
}
  
  