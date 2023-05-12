import { Injectable } from '@nestjs/common';
import { ContratorEntity } from '../entity/contrator.entity';

import { exportExcel } from 'src/common/export/exportExcel';
import { exportPdf } from 'src/common/export/exportPdf';

@Injectable()
export class ContractorExportService {
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
    return exportExcel(contractor.contractors, columns, 'Clientes');
  }
  exportExcelDetailedContract(data: ContratorEntity[]) {
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
    console.log(allTravelers, data);
    return exportExcel(allTravelers, columns, 'Viajeros por Cliente');
  }
  exportAllContractorToPdf(contractor: ContratorEntity[]) {
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
    return exportPdf(contractor, columns, 'Clientes');
  }
  exportPdfInvoicing(contractor: any) {
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
      { property: 'client', label: 'Nombre', width: 120 },
      {
        property: 'poliza',
        label: 'Poliza',
        width: 50,
      },
      {
        property: 'total_travelers',
        label: 'Total de Viajeros',
        width: 50,
        align: 'center',
      },
      {
        property: 'total_import',
        label: 'Importe',
        width: 50,
        align: 'center',
      },
    ];
    return exportPdf(contractor, columns, 'Facturacion Mensual');
  }
}
