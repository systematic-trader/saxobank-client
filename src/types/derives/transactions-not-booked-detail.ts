import {
  type GuardType,
  number,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export interface TransactionsNotBookedDetail extends GuardType<typeof TransactionsNotBookedDetail> {}

export const TransactionsNotBookedDetail = props({
  /** Net accrual for the transaction(s) not booked yet */
  Accrual: number(),

  /** Net additional transaction cost for the transaction(s) not booked yet */
  AdditionalTransactionCost: number(),

  /** Net bond value for the transaction(s) not booked yet */
  BondValue: number(),

  /** Net cash deposit for the transaction(s) not booked yet */
  CashDeposit: number(),

  /** Net cash reservation for the transaction(s) not booked yet */
  CashReservation: number(),

  /** Net cash withdrawal for the transaction(s) not booked yet */
  CashWithdrawal: number(),

  /** Net value of certificates for the transaction(s) not booked yet */
  CertificatesValue: number(),

  /** Net commission for the transaction(s) not booked yet */
  Commission: number(),

  /** Net exchange fee for the transaction(s) not booked yet */
  ExchangeFee: number(),

  /** Net external charges for the transaction(s) not booked yet */
  ExternalCharges: number(),

  /** Net funds reserved by order for the transaction(s) not booked yet */
  FundsReservedByOrder: number(),

  /** IPO subscription fee for the transaction(s) not booked yet */
  IpoSubscriptionFee: number(),

  /** Net value of leveraged knock-out products (Turbos) for the transaction(s) not booked yet. */
  LeveragedKnockOutProductsValue: number(),

  /** Net mutual fund value for the transaction(s) not booked yet */
  MutualFundValue: number(),

  /** Net option premium for the transaction(s) not booked yet */
  OptionPremium: number(),

  /** Net share value for the transaction(s) not booked yet */
  ShareValue: number(),

  /** Net stamp duty for the transaction(s) not booked yet */
  StampDuty: number(),

  /** Net warrant premium for the transaction(s) not booked yet */
  WarrantPremium: number(),
})
