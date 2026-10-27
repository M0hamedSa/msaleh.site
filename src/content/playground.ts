// The Playground's windows. Everything shown is real: the README is the About
// copy, and schema.sql is Aqsat's ledger table as its migration creates it
// (aqsat/drizzle/0011_ledger.sql, the identity options shortened), with the
// late-fee check added by 0029.

export const README = `# Mohamed Saleh
Systems developer · Giza

I keep a textile mill's ERP running, was a core part of its move to Odoo, and build the web systems around it.

## Featured
- True Visor   offline factory audits
- Aqsat        installment contracts
- True Legal   a law firm's client ledger
- Kidzenia     a factory's online store

## Contact
moh.sa.dev@gmail.com
github.com/M0hamedSa`;

export const SCHEMA = `-- aqsat · every financial event is one immutable row;
-- a balance is their sum (ADR-0001).
CREATE TABLE "ledger_entries" (
  "id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "customer_id" uuid NOT NULL,
  "contract_id" uuid,
  "entry_type" text NOT NULL,
  "entry_date" date NOT NULL,
  "direction" text NOT NULL,
  "amount" numeric(14, 2) NOT NULL,
  "signed_amount" numeric(14, 2) GENERATED ALWAYS AS
    (case when direction = 'debit' then amount else -amount end) STORED,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "ledger_amount_positive" CHECK ("amount" > 0),
  CONSTRAINT "ledger_direction_check"
    CHECK ("direction" in ('debit', 'credit'))
);

-- Lateness is counted, never charged (ADR-0035).
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_no_late_payment_fee"
  CHECK ("entry_type" <> 'late_payment_fee') NOT VALID;`;
