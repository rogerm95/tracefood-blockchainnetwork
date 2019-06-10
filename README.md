# tracefood-network


> This is an Food Tracking Business Network called TraceFood. It covers from the moment the farmer plants the food to the moment the consumer buys the food.

This business network defines:

**Participants**
`Farmer` `Provider` `Distributor` `Seller` `Consumer`

**Assets**
`Food` `Shipment` `Shop` `Warehouse`

**Transactions**
`plantFood` `harvestFood` `createShipment` `pack` `registerWarehouse` `registerShop` `providerPickupFromFarmer` `storeInWarehouse` `pickedUpFromWarehouse` `shopDelivery` `foodSold` `SetupDemo`



<!-- To test this Business Network Definition in the **Test** tab:

Submit a `SetupDemo` transaction:

```
{
  "$class": "com.biz.SetupDemo"
}
```

This transaction populates the Participant Registries with two `Farmer` participants and a `Regulator` participant. The Asset Registries will have eight `Animal` assets, two `Business` assets and four `Field` assets.

Submit a `AnimalMovementDeparture` transaction:

```
{
  "$class": "com.biz.AnimalMovementDeparture",
  "fromField": "resource:com.biz.Field#FIELD_1",
  "animal": "resource:com.biz.Animal#ANIMAL_1",
  "from": "resource:com.biz.Business#BUSINESS_1",
  "to": "resource:com.biz.Business#BUSINESS_2"
}
```

This transaction moves `ANIMAL_1` from `FIELD_1` at `BUSINESS_1` to `BUSINESS_2`.

Submit a `AnimalMovementArrival` transaction:

```
{
  "$class": "com.biz.AnimalMovementArrival",
  "arrivalField": "resource:com.biz.Field#FIELD_2",
  "animal": "resource:com.biz.Animal#ANIMAL_1",
  "from": "resource:com.biz.Business#BUSINESS_1",
  "to": "resource:com.biz.Business#BUSINESS_2"
}
```

This transaction confirms the receipt of `ANIMAL_1` from `BUSINESS_1` to `FIELD_2` at `BUSINESS_2`.

Congratulations!

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/. -->
