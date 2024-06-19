import { Injectable } from '@nestjs/common';
import { ContratorEntity } from '../entity/contrator.entity';

import { exportExcel } from 'src/common/export/exportExcel';
import { exportPdf } from 'src/common/export/exportPdf';
import { DateHelper } from 'src/common/date/helper/date.helper';
import { FilterContractorDto } from '../dto/filter-contractor.dto';
import { LogginService } from 'src/loggin/loggin.service';

@Injectable()
export class ContractorExportService {
  constructor(private readonly loggingService: LogginService) {}
  async exportExcel(contractor: ContratorEntity[]) {
    const columns = [
      { key: 'client', header: 'Nombre' },
      {
        key: 'poliza',
        header: 'Poliza',
      },
      {
        key: 'email',
        header: 'Correo',
      },
      {
        key: 'addres',
        header: 'Direccion',
      },
      {
        key: 'telf',
        header: 'Telefono',
      },
      {
        key: 'file',
        header: 'Carpeta',
      },
      {
        key: 'isActive',
        header: 'Estado',
      },
    ];
    this.log('Exportando a Excel los contratantes ');
    return exportExcel(contractor, columns, 'Clientes');
  }

  async exportExcelInvoicing(contractor: any) {
    const { total_amount, total_travelers } = contractor;
    const total = {
      client: 'Total',
      poliza: '-',
      total_travelers: total_travelers,
      total_import: total_amount,
    };
    contractor.contractors.push(total);
    const columns = [
      { key: 'client', header: 'Nombre' },
      {
        key: 'poliza',
        header: 'Poliza',
      },
      {
        key: 'total_travelers',
        header: 'Total de Viajeros',
      },
      {
        key: 'total_import',
        header: 'Importe',
      },
    ];
    this.log('Exportando a Excel Facturacion Mensual');
    return exportExcel(contractor.contractors, columns, 'Clientes');
  }
  async exportExcelDetailedContract(data: ContratorEntity[]) {
    let allTravelers = [];
    data.map((contractor) => {
      allTravelers = allTravelers.concat(contractor.travelers);
    });

    const columns = [
      { key: 'name', header: 'Nombre' },
      {
        key: 'contractor',
        header: 'Cliente',
      },
      { key: 'sex', header: 'Sexo' },
      { key: 'born_date', header: 'Fecha de Nacimiento' },
      { key: 'email', header: 'Correo' },

      { key: 'passport', header: 'Pasaporte' },

      { key: 'flight', header: 'Vuelo' },
      { key: 'sale_date', header: 'Fecha de Venta' },

      { key: 'start_date', header: 'Fecha de Inicio' },

      { key: 'end_date_policy', header: 'Fecha de Fin de Viaje' },

      {
        key: 'number_high_risk_days',
        header: 'Numero de dias Alto Riesgo',
      },

      { key: 'number_days', header: 'Cantidad de Dias', type: 'number' },

      {
        key: 'amount_days_high_risk',
        header: 'Monto de dias de alto riesgo',
      },

      {
        key: 'amount_days_covered',
        header: 'Monto de dias cubiertos',
      },

      { key: 'total_amount', header: 'Monto total' },

      { key: 'state', header: 'Estado' },

      { key: 'contractor', header: 'Cliente' },

      { key: 'origin_country', header: 'Pais origen' },

      { key: 'file', header: 'Fichero' },

      { key: 'nationality', header: 'Nacionalidad' },

      { key: 'coverage', header: 'Cobertura' },
    ];
    this.log('Exportando a Excel  Facturacion detallada');
    return exportExcel(allTravelers, columns, 'Viajeros por Cliente');
  }
  async exportAllContractorToPdf(contractor: ContratorEntity[]) {
    const columns = [
      { property: 'client', label: 'Nombre', width: 100 },
      {
        property: 'poliza',
        label: 'Poliza',
        align: 'center',
        width: 50,
      },
      {
        property: 'email',
        label: 'Correo',
        width: 120,
      },
      {
        property: 'telf',
        label: 'Telefono',
        width: 120,
      },
      {
        property: 'file',
        label: 'Carpeta',
        width: 50,
      },
      {
        property: 'isActive',
        label: 'Activo',
        align: 'center',
        width: 50,
      },
    ];
    this.log('Exportando a PDF los contratantes');
    return exportPdf(contractor, columns, 'Clientes');
  }
  async exportPdfInvoicing(contractor: any, date: Date) {
    //creo un objeto nuevo para q al final se agrege una fila con los totales
    const { total_amount, total_travelers } = contractor;
    const total = {
      client: 'Total',
      poliza: '-',
      total_travelers: total_travelers,
      total_import: total_amount,
    };
    contractor.contractors.push(total);
    const columns = [
      { property: 'client', label: 'Nombre', width: 150 },
      {
        property: 'poliza',
        label: 'Poliza',
        width: 100,
      },
      {
        property: 'total_travelers',
        label: 'Total de Viajeros',
        width: 80,
        align: 'center',
      },
      {
        property: 'total_import',
        label: 'Importe',
        width: 70,
        align: 'center',
      },
    ];
    this.log('Exportando a PDF Facturacion');
    const month = DateHelper.getMonthByDate(date);
    return exportPdf(
      contractor.contractors,
      columns,
      'Reporte Facturación Mensual',
      undefined,
      undefined,
      `Viajeros: ${total_travelers}    Importe Total: $${total_amount}    Mes: ${month}`,
    );
  }
  async exportPdfDetailedContract(data: ContratorEntity[]) {
    let allTravelers = [];
    data.map((contractor) => {
      allTravelers = allTravelers.concat(contractor.travelers);
    });

    const columns = [
      { property: 'name', label: 'Nombre', width: 100 },

      { property: 'passport', label: 'Pasaporte', width: 80 },

      { property: 'start_date', label: 'Fecha de Inicio', width: 50 },

      {
        property: 'end_date_policy',
        label: 'Fecha de Fin de Viaje',
        width: 50,
      },

      {
        property: 'number_high_risk_days',
        label: 'Cant dias Alto Riesgo',
        width: 30,
      },

      { property: 'number_days', label: 'Num de Dias', width: 30 },

      {
        property: 'amount_days_high_risk',
        label: 'Monto alto riesgo',
        width: 30,
      },

      {
        property: 'amount_days_covered',
        label: 'Monto dias cubiertos',
        width: 30,
      },

      { property: 'total_amount', label: 'Monto total', width: 30 },

      { property: 'contractor', label: 'Cliente', width: 50 },

      { property: 'coverage', label: 'Cobertura', width: 50 },
    ];
    this.log('Exportando a PDF Facturacion Detallada');
    return exportPdf(allTravelers, columns, 'Viajeros por Cliente');
  }
  async exportPdfPolicyOverview(data: any, filter: FilterContractorDto) {
    const { totalAmount, totalTravelers, contractors } = data;

    const columns = [
      { property: 'client', label: 'Nombre', width: 200, align: 'center' },
      {
        property: 'start_date',
        label: 'Fecha de Inicio',
        width: 100,
        align: 'center',
      },
      {
        property: 'total_travelers',
        label: 'Cantidad de Viajeros',
        width: 100,
        align: 'center',
      },
      {
        property: 'total_import',
        label: 'Importe',
        width: 100,
        align: 'center',
      },
    ];
    this.log('Exportando a PDF Resumen Poliza');
    return exportPdf(
      contractors,
      columns,
      'Resumen de Pólizas',
      undefined,
      undefined,
      `Viajeros: ${totalTravelers}   Importe Total: $${totalAmount} 
      Desde: ${DateHelper.getFormatedDate(filter.dateInitFactRange)} Hasta: ${DateHelper.getFormatedDate(filter.dateEndFactRange)}`,
    );
  }
  async exportExcelPolicyOverview(data: any) {
    const { totalAmount, totalTravelers, contractors } = data;
    const total = {
      client: 'Total',
      start_date: '-',
      total_travelers: totalTravelers,
      total_import: totalAmount,
    };
    contractors.push(total);
    const columns = [
      { key: 'client', header: 'Cliente' },
      { key: 'start_date', header: 'Fecha Inicio', type: 'date' },
      { key: 'total_travelers', header: 'Viajeros', type: 'number' },
      { key: 'total_import', header: 'Importe', type: 'number' },
    ];
    this.log('Exportando a Excel Resumen Polizas Resumen Polizas');
    return exportExcel(contractors, columns, 'Resumen de Pólizas');
  }
  async log(message: string, level = 'info') {
    this.loggingService.create({
      message,
      context: 'Coverage export Service',
      level,
      createdAt: new Date().toISOString(),
    });
  }
}
