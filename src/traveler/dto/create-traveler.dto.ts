export class CreateTravelerDto {
  id: number;
  name: string;
  sex: string;
  born_date: Date;
  email: string;
  passport: string;
  sale_date: Date;

  start_date: Date;
  end_date_policy: Date;

  number_high_risk_days: number;
  number_days: number;
  amount_days_high_risk: number;
  amount_days_covered: number;
  total_amount: number;
  state: number;
  createdAt: Date;
  contractor;
  origin_country;
  nationality;
  coverage;
}
