import { Elementos } from "./elementos";
import {ElementosCotizacion} from "./elementos_cotizacion"

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
    elementos_cotizacion: ElementosCotizacion[];

}
