import {
  array,
  format,
  integer,
  optional,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export const IpoDetails = props({
  ActivationFrom: format('date-iso8601'),
  ActivationTo: format('date-iso8601'),
  AllotmentDate: format('date-iso8601'),
  Denominations: optional(array(integer())),
  ListingDate: format('date-iso8601'),
  MarketDeadline: format('date-iso8601'),
  MaxLeveragePct: integer(),
  MaxLotSize: integer(),
})
