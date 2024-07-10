import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Proyectos } from '../models/proyectos';

@Injectable({
  providedIn: 'root'
})
export class PdfGenerateService {

  constructor() { }

  generatePdf(contenidoHtml:  HTMLElement, proyecto: Proyectos):jsPDF  {
    const pdf = new jsPDF();

    html2canvas(contenidoHtml).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 208, 295);
      pdf.save( `${proyecto.idProyecto}-${proyecto.cliente.nombre_cliente}`); // O puedes devolver el pdf para más flexibilidad
    });
    return pdf;
  }
}
