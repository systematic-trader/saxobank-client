import {
  enums,
  type GuardType,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type AssetType = GuardType<typeof AssetType>

export const AssetType = enums([
  /* Not tradeable */
  'Cash',
  /**
   * Bond
   */
  'Bond',

  /**
   * Callable Bull/Bear Contract Category N. Call price or level is equal to
   * its strike price or level, under which you will not receive any cash
   * payment after the occurrence of a mandatory call event, and will lose your
   * entire investment.
   */
  'CBBCCategoryN',

  /**
   * Callable Bull/Bear Contract Category R. Call price or level is different
   * from its strike price or level, and you may receive a residual cash
   * payment (called "residual value") upon the occurrence of a mandatory call
   * event. However, in the worst case, you will not receive any residual value
   * and will lose your entire investment.
   */
  'CBBCCategoryR',

  /**
   * A Discount Certificate with Barrier allows investors with moderate to high
   * risk tolerance to buy a selected underlying asset at a discount. The more
   * favorable entry price gives a yield advantage, so that an attractive
   * return is possible even in a sideways market.
   */
  'CertificateBarrierDiscount',

  /**
   * With Barrier Reverse Convertibles investors with a moderate-to-high risk
   * tolerance in sideways moving markets can optimize their opportunities to
   * earn yields thanks to a coupon. As in the Reverse Convertibles, the coupon
   * is always paid out. The type and amount of the repayment of the nominal
   * amount on expiry is aligned to the price of the underlying asset (e.g.
   * individual equity, share index, equity basket, currency pair or
   * commodity).
   */
  'CertificateBarrierReverseConvertibles',

  /**
   * Mirrors the price movement of the underlying only if and when the
   * underlying price exceeds the defined barrier. If the certificate expires
   * below the barrier, it offers partial protection/return of investment.
   */
  'CertificateBonus',

  /**
   * Capital protection certificates with coupon, also known as Coupon CPNs,
   * are capital protected at maturity. This means that at the end of the
   * usually multi-year term, you will always receive at least 90% of the
   * nominal amount back. Depending on the features, the capital protection is
   * usually between 90% and 100% of the nominal value.
   */
  'CertificateCapitalProtectionWithCoupon',

  /**
   * Capital Protection Certificates with Barrier, also known as Barrier CPNs
   * or Dolphin CPNs, are capital protected at maturity. The capital protection
   * usually amounts to 90 - 100 percent of the nominal value, so that at
   * maturity you will be paid back at least 90% of the capital invested at
   * issue - regardless of the underlying asset.
   */
  'CertificateCapitalProtectionWithKnockOut',

  /**
   * Certificate Capped Bonus.
   */
  'CertificateCappedBonus',

  /**
   * Guarantees a capped percentage increase of the underlying asset's value
   * above the issue price at expiry/maturity. Max loss is the amount invested
   * multiplied by the CapitalProtection percentage.
   */
  'CertificateCappedCapitalProtected',

  /**
   * Capped Outperformance Certificate.
   */
  'CertificateCappedOutperformance',

  /**
   * Certificate Constant Leverage.
   */
  'CertificateConstantLeverage',

  /**
   * Yields a capped return if the underlying asset's value is above the
   * specified cap level at expiry. If the underlying's value is below the
   * strike at expiry, the investor received the underlying or equivalent
   * value. Offers direct exposure in underlying at a lower price (discount)
   * with a capped potential profit and limited loss.
   */
  'CertificateDiscount',

  /**
   * Certificate Express kick out.
   */
  'CertificateExpress',

  /**
   * Capital protection products are the most defensive form of Investment
   * Products and are therefore suitable for investors with a low to moderate
   * risk tolerance.
   */
  'CertificateOtherCapitalProtection',

  /**
   * Constant Leverage Certificates, aka Factor Certificates, enable investors
   * who are willing to take risks to participate disproportionately in the
   * price performance of an underlying asset (e.g. equities, indices,
   * commodities or currency pairs)
   */
  'CertificateOtherConstantLeverage',

  /**
   * Participation products are covered by Tracker Certificates. These
   * Certificates are suitable for investors with a medium to high risk
   * preference who want to participate cost efficiently and unlimitedly in the
   * price development of a single stock, a market or a market segment.
   */
  'CertificateOtherParticipation',

  /**
   * Investment Products aimed at optimizing yields offer partial protection.
   * This can provide attractive returns even when the price of the respective
   * underlying asset just remains stationary up to maturity.
   */
  'CertificateOtherYieldEnhancement',

  /**
   * With Bonus-Outperformance Certificates, you can apply leverage, since
   * Bonus-Outperformance Certificates offer you the chance to participate
   * disproportionately and without restriction in rising prices of the
   * underlying asset (e.g. an equity, an index or a currency pair). This means
   * that as of a predefined price level (the so-called strike level)
   * participation in a potentially rising price performance is higher than
   * 100%. The exact performance rate varies depending on the product features
   * and is fixed per issue.
   */
  'CertificateOutperformanceBonus',

  /**
   * With Reverse Convertibles investors with a moderate-to-high risk tolerance
   * in sideways moving markets can optimize their opportunities to earn yields
   * thanks to a coupon. While the coupon is always paid out, the type and
   * amount of the repayment of the nominal amount on expiration is aligned to
   * the price of the underlying asset (e.g. individual equity, share index,
   * equity basket, currency pair or commodity).
   */
  'CertificateReverseConvertibles',

  /**
   * A certificate that mirrors the price movement of the underlying
   * instrument. Often used to trade movements in indicies. Movements can be a
   * fixed ratio of the underlying and can be inverted for bearish/short
   * speculation. Risk is equivalent to owning the underlying.
   */
  'CertificateTracker',

  /**
   * With Twin-Win Certificates, you can pull off a remarkable balancing act on
   * the markets, i.e. whether the underlying asset (e.g. equity or index)
   * rises or falls, you can profit in both cases. In doing so, you participate
   * 1:1 in price gains of the underlying asset over and above the strike price
   * without restriction (taking into account the subscription ratio). Price
   * losses below the strike price are, on the other hand, converted
   * accordingly on the due date if the price of the underlying asset has never
   * fallen to or below a specific barrier (Knock-Out Level) during the term.
   * However, after a barrier has been broken the conversion of prices losses
   * of the underlying asset into gains ceases to apply. Instead, in this case
   * Twin-Win Certificates behave like conventional Tracker Certificates, so
   * that price losses of the underlying asset (under the strike price) lead to
   * corresponding losses in the certificate.
   */
  'CertificateTwinWin',

  /**
   * Guarantees a percentage increase of the underlying asset's value above the
   * issue price at expiry/maturity. Max loss is the amount invested multiplied
   * by the CapitalProtection percentage.
   */
  'CertificateUncappedCapitalProtection',

  /**
   * Provides leveraged returns when the underlying price exceeds the threshold
   * strike price. The amount leverage is defined by the Participation %. When
   * the underlying is below the strike price, the certificate mirrors the
   * underlying price 1:1.
   */
  'CertificateUncappedOutperformance',

  /**
   * Cfd Index Option
   */
  'CfdIndexOption',

  /**
   * Cfd on unlisted warrant issued by a corporation.
   */
  'CfdOnCompanyWarrant',

  /**
   * Cfd on Etc
   */
  'CfdOnEtc',

  /**
   * Cfd on Etf
   */
  'CfdOnEtf',

  /**
   * Cfd on Etn
   */
  'CfdOnEtn',

  /**
   * Cfd on Fund
   */
  'CfdOnFund',

  /**
   * Cfd on Futures
   */
  'CfdOnFutures',

  /**
   * Cfd on Stock Index
   */
  'CfdOnIndex',

  /**
   * Cfd on Rights
   */
  'CfdOnRights',

  /**
   * Cfd on Stock
   */
  'CfdOnStock',

  /**
   * Unlisted warrant issued by a corporation, often physically settled.
   */
  'CompanyWarrant',

  /**
   * Contract Futures
   */
  'ContractFutures',

  /**
   * Etc
   */
  'Etc',

  /**
   * Exchange traded fund.
   */
  'Etf',

  /**
   * Exchange traded note.
   */
  'Etn',

  /**
   * Fund
   */
  'Fund',

  /**
   * Futures Option
   */
  'FuturesOption',

  /**
   * Futures Strategy
   */
  'FuturesStrategy',

  /**
   * Forex Binary Option
   */
  'FxBinaryOption',

  /**
   * Forex Knock In Option.
   */
  'FxKnockInOption',

  /**
   * Forex Knock Out Option.
   */
  'FxKnockOutOption',

  /**
   * Forex No Touch Option.
   */
  'FxNoTouchOption',

  /**
   * Forex One Touch Option.
   */
  'FxOneTouchOption',

  /**
   * Forex Forwards
   */
  'FxForwards',

  /**
   * Forex Spot
   */
  'FxSpot',

  /**
   * Forex Swap
   */
  'FxSwap',

  /**
   * Forex Vanilla Option
   */
  'FxVanillaOption',

  /**
   * Danish investment scheme (“Grantbevis”). Not online tradeable.
   */
  'GuaranteeNote',

  /**
   * Inline Warrants. Holders receive a pre-determined amount that depends on
   * whether an underlying asset falls at, or within or outside the upper and
   * lower strikes at expiry.
   */
  'InlineWarrant',

  /**
   * Initial Public Offering on Stock
   */
  'IpoOnStock',

  /**
   * Mini Future
   */
  'MiniFuture',

  /**
   * Mutual Fund
   */
  'MutualFund',

  /**
   * Danish pooled investment scheme (“Pulje”). Not online tradeable.
   */
  'PortfolioNote',

  /**
   * Rights
   */
  'Rights',

  /**
   * Stock
   */
  'Stock',

  /**
   * Stock Index
   */
  'StockIndex',

  /**
   * Stock Index Option
   */
  'StockIndexOption',

  /**
   * Stock Option
   */
  'StockOption',

  /**
   * Used for IPO/Subscription.
   */
  'SubscriptionOnCertificate',

  /**
   * Warrant
   */
  'Warrant',

  /**
   * Warrant with two knock-out barriers.
   */
  'WarrantDoubleKnockOut',

  /**
   * Warrant with one knock-out barrier.
   */
  'WarrantKnockOut',

  /**
   * Knock-out Warrant with no expiry.
   */
  'WarrantOpenEndKnockOut',

  /**
   * In the case of Warrants with Knock-Out, aka Turbos, the name says it all.
   * With these investment instruments, investors who are willing to take risks
   * can shift into turbo and considerably increase their yield potential.
   */
  'WarrantOtherLeverageWithKnockOut',

  /**
   * Warrants allow investors who are willing to take risks can choose between
   * Call and Put Warrants. Call Warrants benefit from rising prices of the
   * underlying asset whereas. Put Warrants rely on falling prices of the
   * underlying asset.
   */
  'WarrantOtherLeverageWithoutKnockOut',

  /**
   * Warrant with built-in spread.
   */
  'WarrantSpread',
])
