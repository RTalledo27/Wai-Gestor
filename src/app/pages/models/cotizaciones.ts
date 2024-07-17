import { Elementos } from "./elementos";
import {ElementosCotizacion} from "./elementos_cotizacion"
import { Proyectos } from "./proyectos";

export interface Cotizaciones {
    idCotizacion: number;
    idEmpleado: number;
    idCliente: number;
    proyecto: Proyectos;
    idEstado: number;
    fecha_cotizacion: Date;
    subtotal: number;
    descuento: number;
    total: number;
    elementos: ElementosCotizacion[];
    elementos_cotizacion: ElementosCotizacion[];

}
