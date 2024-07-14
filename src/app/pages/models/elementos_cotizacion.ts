import { Elementos } from "./elementos";
import {Cotizaciones} from "./cotizaciones";
export interface ElementosCotizacion {
    idElementos_cotizacion: number;
    idCotizacion: number;
    idElemento: number;
    elementos: Elementos[];   
    cotizacion: Cotizaciones[];
}
