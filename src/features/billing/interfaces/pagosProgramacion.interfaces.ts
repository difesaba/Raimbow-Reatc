export interface PagosProgramacionDetalle {
  SubdivisionId: number;
  SubName: string;
  TownHomeId: number;
  Number: string;
  NAME: string;
  ProgressStatusId: number;
  FullName: string;
  IsComplete: number;
  UserIdCV: number;
  Company: string;
  IsTownHome: number;
  UserId: number;
  UserRainbow: number;
  InitialDate: string;
  StartDate: string;
  TaskId: number;
}

export interface PagosProgramacionResumen {
  UserId: number;
  FullName: string;
  Detalles: PagosProgramacionDetalle[];
}

export interface PagosProgramacionWeekRange {
  ini: string;
  fin: string;
}

export interface CreateFacturaDetalleDTO {
  TaskId: number;
  Valor: number;
  SubName: string;
  LoteNumber: string;
  NAME: string;
  Company: string;
  InitialDate: string;
}

export interface CreateFacturaDTO {
  UserRainbow: number;
  FullName: string;
  IniDate: string;
  FinDate: string;
  Detalles: CreateFacturaDetalleDTO[];
}

export interface CreateFacturaResponse {
  FacturaId: number;
  Number: string;
}

export interface PagosProgramacionFactura {
  FacturaId: number;
  Number: string;
  UserRainbow: number;
  FullName: string;
  IniDate: string;
  FinDate: string;
  CreatedAt: string;
  TotalValor: number;
  TotalItems: number;
}

export interface PagosProgramacionFacturaDet {
  DetId: number;
  FacturaId: number;
  TaskId: number;
  Valor: number;
  SubName: string;
  LoteNumber: string;
  NombreTarea: string;
  Company: string;
  InitialDate: string;
  CreatedAt: string;
}

export interface PagosProgramacionFacturaWithDet extends PagosProgramacionFactura {
  detalles: PagosProgramacionFacturaDet[];
}
