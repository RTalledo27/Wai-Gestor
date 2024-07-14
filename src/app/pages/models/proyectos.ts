import { Clientes } from "./clientes";
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

    fecha_fin: Date;
}
