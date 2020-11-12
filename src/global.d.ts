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

  type UsuarioType = {
    idUsuario: ID;
    nombre: string;
    email: string;
  };

  type VendedorType = {
    idVendedor: ID;
    nombre: string;
    email: string;
  };

  interface VentaType {
    idVenta: ID;
    fecha: Date;
    concepto?: string;
    idVendedor?: ID;
    cantidad: number;
    iva: boolean;
    precioUnitario?: number;
    ctaRaed?: boolean;
  }

  type SalidaType = {
    idSalida: ID;
    fecha: Date;
    concepto: string;
    importe: number;
    reintegro?: boolean;
    pagoiva?: boolean;
    idVendedor?: ID;
    ctaRaed?: boolean;
    iva?: number;
  };

  type ConsignaType = {
    idConsigna: ID;
    idDistribuidor: ID;
    fecha: Date;
    idVendedor: ID;
    entregados: number;
    porcentaje: number;
    vendidos: number;
    devueltos: number;
    facturado: number;
    nroFactura: string;
    cobrado: number;
    ctaRaed: boolean;
    comentarios: string;
  };

  type ConfigType = {
    PVP: number;
    comisionEstandar: number;
    IVALibros: number;
    comisionInterna: number;
  };
}

export {};
