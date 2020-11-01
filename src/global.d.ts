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
    fecha: string;
    concepto?: string;
    idVendedor?: ID;
    cantidad: number;
    iva: boolean;
    precioUnitario?: number;
  }
}
export {};
