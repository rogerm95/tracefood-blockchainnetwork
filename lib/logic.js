

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.example.model.plantFood} plantFood
 * @transaction
 */
async function plantFood(plantFood) {

    var farmer = plantFood.farmer;
    var product = plantFood.type;
    var date = plantFood.date

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        var foodAsset = getFactory().newResource('org.example.model', 'Food', 'LE_001');
        foodAsset.type = product;
        foodAsset.plantDate = date;
        foodAsset.farmer = farmer;
        foodAsset.state = 'GOOD';
        foodAsset.status = 'PLANTED';
        return assetRegistry.add(foodAsset);
    });


    // Emit an event for the modified asset.
    // let event = getFactory().newEvent('org.example.tracefood', 'SampleEvent');
    // event.asset = tx.asset;
    // event.oldValue = oldValue;
    // event.newValue = tx.newValue;
    // emit(event);
}

/**
 * Sample transaction
 * @param {org.example.model.registerWarehouse} registerWarehouse
 * @transaction
 */

async function registerWarehouse(registerWarehouse) {
    var provider = registerWarehouse.owner;
    var warehouseName = registerWarehouse.name;
    var address = provider.address;
    var location = registerWarehouse.location;

    return getAssetRegistry('org.example.model.Warehouse').then(function (assetRegistry) {
        var warehouseAsset = getFactory().newResource('org.example.model', 'Warehouse', 'WA_001');
        warehouseAsset.owner = provider;
        warehouseAsset.name = warehouseName;
        warehouseAsset.address = address;
        warehouseAsset.location = location;
        return assetRegistry.add(warehouseAsset);
    });

}

/**
* Sample transaction
* @param {org.example.model.registerShop} registerShop
* @transaction
*/

async function registerShop(registerShop) {
    var seller = registerShop.owner;
    var shopName = registerShop.name;
    var address = seller.address;
    var location = registerShop.location;

    return getAssetRegistry('org.example.model.Shop').then(function (assetRegistry) {
        var shopAsset = getFactory().newResource('org.example.model', 'Shop', 'SH_001');
        shopAsset.owner = seller;
        shopAsset.name = shopName;
        shopAsset.address = address;
        shopAsset.location = location;
        let event = getFactory().newEvent('org.example.model', 'ShopRegistered');
        event.shop = shopAsset;
        event.seller = seller;
        emit(event);
        return assetRegistry.add(shopAsset);
    });

}

/**
* Sample transaction
* @param {org.example.model.harvestFood} harvestFood
* @transaction
*/

async function harvestFood(harvestFood) {

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        return assetRegistry.exists(harvestFood.food.foodId).then(function (foodExists) {
            if (foodExists) {
                return assetRegistry.get(harvestFood.food.foodId).then(function (foodToUpdate) {
                    if (foodExists.status === 'PLANTED') {
                        throw new Error('Aliment no llest per collir i ja collit');
                    }
                    foodToUpdate.status = 'HARVESTED';
                    foodToUpdate.harvestedDate = harvestFood.date;

                    return assetRegistry.update(foodToUpdate);
                })
            } else {
                throw new Error("Aquest aliment no esta registrat encara.");
            }
        });
    });
}

/**
* Sample transaction
* @param {org.example.model.providerPickupFromFarmer} providerPickupFromFarmer
* @transaction
*/

async function providerPickupFromFarmer(providerPickupFromFarmer) {

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        return assetRegistry.exists(providerPickupFromFarmer.food.foodId).then(function (foodExists) {
            if (foodExists) {
                return assetRegistry.get(providerPickupFromFarmer.food.foodId).then(function (foodToUpdate) {
                    if (foodToUpdate.status !== 'HARVESTED') {
                        throw new Error('Aliment no llest per recollir o ja recollit');
                    }

                    foodToUpdate.provider = providerPickupFromFarmer.provider;
                    foodToUpdate.state = providerPickupFromFarmer.state;
                    foodToUpdate.status = 'TRANSIT';
                    foodToUpdate.pickedUpDate = providerPickupFromFarmer.date;

                    return assetRegistry.update(foodToUpdate);
                })

            } else {
                throw new Error("Aquest aliment no esta registrat encara.");
            }
        });
    });
}

/**
* Sample transaction
* @param {org.example.model.storeInWarehouse} storeInWarehouse
* @transaction
*/

async function storeInWarehouse(storeInWarehouse) {

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        return assetRegistry.exists(storeInWarehouse.food.foodId).then(function (foodExists) {
            if (foodExists) {
                return assetRegistry.get(storeInWarehouse.food.foodId).then(function (foodToUpdate) {
                    if (foodToUpdate.status !== 'TRANSIT') {
                        throw new Error('Aliment no es pot emmagatzemar');
                    }

                    foodToUpdate.state = storeInWarehouse.state;
                    foodToUpdate.warehouse = storeInWarehouse.warehouse;
                    foodToUpdate.status = 'STORED';
                    foodToUpdate.enterWarehouseDate = storeInWarehouse.date;

                    return assetRegistry.update(foodToUpdate);
                })
            } else {
                throw new Error("Aquest aliment no esta registrat encara.");
            }
        });
    });
}

/**
* Sample transaction
* @param {org.example.model.pickedUpFromWarehouse} pickedUpFromWarehouse
* @transaction
*/
async function pickedUpFromWarehouse(pickedUpFromWarehouse) {

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        return assetRegistry.exists(pickedUpFromWarehouse.food.foodId).then(function (foodExists) {
            if (foodExists) {
                return assetRegistry.get(pickedUpFromWarehouse.food.foodId).then(function (foodToUpdate) {
                if (foodToUpdate.status !== 'STORED') {
                    throw new Error('Aliment no es pot emmagatzemar');
                }

                if (foodToUpdate.warehouse.warehouseId != pickedUpFromWarehouse.warehouse.warehouseId) {
                    throw new Error('Ep, estas recollint un aliment que te registrat un magatzem diferent on s\'esta recollint!');
                }
                foodToUpdate.state = pickedUpFromWarehouse.state;
                foodToUpdate.status = 'TRANSIT';
                foodToUpdate.pickedUpFromWarehouse = pickedUpFromWarehouse.date;

                return assetRegistry.update(foodToUpdate);
            })
            } else {
                throw new Error("Aquest aliment no esta registrat encara.");
            }
        });
    });
}


/**
* Sample transaction
* @param {org.example.model.shopDelivery} shopDelivery
* @transaction
*/
async function shopDelivery(shopDelivery) {

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        return assetRegistry.exists(shopDelivery.food.foodId).then(function (foodExists) {
            if (foodExists) {
                return assetRegistry.get(shopDelivery.food.foodId).then(function (foodToUpdate) {
                if (foodToUpdate.status !== 'TRANSIT') {
                    throw new Error('Aliment no es pot emmagatzemar');
                }

                if (foodToUpdate.distributor != shopDelivery.distributor) {
                    throw new Error('Ep, el paquet ha estat recollit per un distribuïdor diferent a qui l\'entrega!');
                }
                foodToUpdate.state = shopDelivery.state;
                foodToUpdate.status = 'TOSELL';
                foodToUpdate.shop = shopDelivery.shop;
                foodToUpdate.seller = shopDelivery.shop.owner;
                foodToUpdate.shopDeliveryDate = shopDelivery.date;

                return assetRegistry.update(foodToUpdate);
            })
            } else {
                throw new Error("Aquest aliment no esta registrat encara.");
            }
        });
    });
}


/**
* Sample transaction
* @param {org.example.model.foodSold} foodSold
* @transaction
*/
async function foodSold(foodSold) {

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        return assetRegistry.exists(foodSold.food.foodId).then(function (foodExists) {
            if (foodExists) {
                return assetRegistry.get(foodSold.food.foodId).then(function (foodToUpdate) {
                if (foodToUpdate.status !== 'TOSELL') {
                    throw new Error('Aliment no es pot emmagatzemar');
                }

                if (foodToUpdate.shop != foodSold.shop) {
                    throw new Error('Ep, el paquet ha estat recollit per un distribuïdor diferent a qui l\'entrega!');
                }
                foodToUpdate.state = foodSold.state;
                foodToUpdate.status = 'SOLD';
                foodToUpdate.shopDeliveryDate = foodSold.date;

                return assetRegistry.update(foodToUpdate);
            })
            } else {
                throw new Error("Aquest aliment no esta registrat encara.");
            }
        });
    });
}



