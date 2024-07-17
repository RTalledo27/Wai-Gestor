import { Clientes } from "./clientes";
import { Cotizaciones } from "./cotizaciones";
import { Empleados } from "./empleados";
import { Estados } from "./estados";





export interface Proyectos {
    idProyecto: number;
    cliente: Clientes;
    empleado: Empleados;
    estado: Estados;
    nombre_proyecto: string;
    descripcion: string;
    fecha_inicio: Date;
    cotizacion: Cotizaciones[];
    fecha_fin: Date;
}
