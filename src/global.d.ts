declare module '*.module.css';
declare module '*.jpg';
declare module '*.gif';

declare global {
  type BootstrapColor =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'dark'
    | 'light';
  type BootstrapSize = 'sm' | 'md' | 'lg';

  type ID = string;

  type DistribuidorType = {
    idDistribuidor: ID;
    nombre: string;
    localidad?: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    nif?: string;
  };

  type VendedorType = {
    idVendedor: ID;
    nombre: string;
    email: string;
  };

  type VentaType = {
    idVenta: ID;
    fecha: Date;
    concepto?: string;
    idVendedor?: ID;
    cantidad: number;
    iva: boolean;
    precioUnitario?: number;
    cuenta?: string;
  };

  type GastoType = {
    idGasto: ID;
    fecha: Date;
    concepto: string;
    importe: number;
    cuenta: string;
    iva?: number;
  };
  type ReintegroType = {
    idReintegro: ID;
    fecha: Date;
    concepto: string;
    importe: number;
    cuenta: string;
  };

  type ComisionType = {
    idComision: ID;
    fecha: Date;
    concepto: string;
    idVendedor: string;
    importe: number;
    cuenta?: string;
  };
  type PagoIvaType = {
    idGasto: ID;
    fecha: Date;
    concepto: string;
    importe: number;
    cuenta: string;
  };

  type ConsignaType = {
    idConsigna: ID;
    idDistribuidor: ID;
    fecha: Date;
    concepto: string;
    movimiento: 'entregados' | 'vendidos' | 'devueltos' | 'facturados';
    cantidad: number;
  };

  type FacturacionType = {
    idFacturacion: ID;
    idDistribuidor: ID;
    fecha: Date;
    concepto: string;
    idVendedor: ID;
    porcentaje: number;
    facturado: number;
    nroFactura: string;
    cobrado: number;
    cuenta: string;
  };

  type ConfigType = {
    PVP: number;
    comisionEstandar: number;
    IVALibros: number;
    comisionInterna: number;
    IVAs: number[];
    precioDescontado: number;
  };

  type CuentaType = {
    idCuenta: ID;
    descr: string;
    color: string;
  };

  type UserType = {
    idUser: ID;
    email: string;
    role: string | string[];
  };
}

export {};
