export class FileErrorsTravelerDto {
  row: number;

  name?: string;

  sex?: string;

  born_date?: Date | string;

  email?: string;

  passport?: string;

  sale_date?: string;

  start_date?: string;

  end_date_policy?: string;

  origin_country?: string;

  nationality: string;

  flight?: string;

  number_days?: string;

  number_high_risk_days?: string;

  amount_days_high_risk: string;

  amount_days_covered?: string;

  total_amount?: string;

  coverage?: string;

  duplicate?: boolean;
}
