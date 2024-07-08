import { Elementos } from "./elementos";


export interface Cotizaciones {
    idCotizacion: number;
    idEmpleado: number;
    idCliente: number;
    idProyecto: number;
    idEstado: number;
    fecha_cotizacion: Date;
    subtotal: number;
    descuento: number;
    total: number;
    elementos: Elementos[];
}
