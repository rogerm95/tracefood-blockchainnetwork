

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.tracefood.model.plantFood} plantFood
 * @transaction
 */
async function plantFood(plantFood) {

    var farmer = plantFood.farmer;
    var product = plantFood.type;
    var date = plantFood.date;
    var foodArray = [];
    var farm = plantFood.farm;

    var idString = plantFood.type.substring(0, 2) + "_";

    return getAssetRegistry('org.tracefood.model.Food').then(function (assetRegistry) {
        return assetRegistry.getAll().then(function(allFood) {
            for(var i = 0; i < plantFood.quantity; i++ ) {
                var newId = allFood.length + (i+1);
                var newIdPretty = idString + ('000'+newId).substring(newId.length);
                var foodAsset = getFactory().newResource('org.tracefood.model', 'Food', newIdPretty);
                foodAsset.type = product;
                foodAsset.plantDate = date;
                foodAsset.farmer = farmer;
                foodAsset.state = 'GOOD';
                foodAsset.status = 'PLANTED';
                foodAsset.farm = farm;
                foodAsset.farmName = farm.name;
                foodAsset.addresses = [farm.address];
                foodAsset.locations = [farm.location];
                foodArray.push(foodAsset);
            }
            return assetRegistry.addAll(foodArray);
        });
    });
}
/**
 * Sample transaction
 * @param {org.tracefood.model.registerWarehouse} registerWarehouse
 * @transaction
 */

async function registerWarehouse(registerWarehouse) {
    var provider = registerWarehouse.owner;
    var warehouseName = registerWarehouse.name;
    var address = registerWarehouse.address;
    var location = registerWarehouse.location;

    return getAssetRegistry('org.tracefood.model.Warehouse').then(function (assetRegistry) {
        return assetRegistry.getAll().then(function(allWarehouses) {
            var newId = allWarehouses.length + 1;
            var newIdPretty = 'WA_' + ('000'+newId).substring(newId.length);
            var warehouseAsset = getFactory().newResource('org.tracefood.model', 'Warehouse', newIdPretty);
            warehouseAsset.owner = provider;
            warehouseAsset.name = warehouseName;
            warehouseAsset.address = address;
            warehouseAsset.location = location;
            return assetRegistry.add(warehouseAsset);
        });
        
    });

}

/**
* Sample transaction
* @param {org.tracefood.model.registerFarm} registerFarm
* @transaction
*/

async function registerFarm(registerFarm) {
    var farmer = registerFarm.owner;
    var farmName = registerFarm.name;
    var address = registerFarm.address;
    var location = registerFarm.location;

    return getAssetRegistry('org.tracefood.model.Farm').then(function (assetRegistry) {
        return assetRegistry.getAll().then(function(allFarms) {
            var newId = allFarms.length + 1;
            var newIdPretty = 'FA_' + ('000'+newId).substring(newId.length);
            var farmAsset = getFactory().newResource('org.tracefood.model', 'Farm', newIdPretty);
            farmAsset.farmer = farmer;
            farmAsset.name = farmName;
            farmAsset.address = address;
            farmAsset.location = location;
            return assetRegistry.add(farmAsset);
        });
        
    });

}

/**
* Sample transaction
* @param {org.tracefood.model.registerShop} registerShop
* @transaction
*/

async function registerShop(registerShop) {
    var seller = registerShop.owner;
    var shopName = registerShop.name;
    var address = registerShop.address;
    var location = registerShop.location;

    return getAssetRegistry('org.tracefood.model.Shop').then(function (assetRegistry) {
        return assetRegistry.getAll().then(function(allShops) {
            var newId = allShops.length + 1;
            var newIdPretty = 'SH_' + ('000'+newId).substring(newId.length);
            var shopAsset = getFactory().newResource('org.tracefood.model', 'Shop', newIdPretty);
            shopAsset.owner = seller;
            shopAsset.name = shopName;
            shopAsset.address = address;
            shopAsset.location = location;
            return assetRegistry.add(shopAsset);
        });
        
    });

}

/**
* Sample transaction
* @param {org.tracefood.model.createShipment} createShipment
* @transaction
*/

async function createShipment(createShipment) {
    var date = createShipment.date;
    var farmer = createShipment.farmer;
    var type = createShipment.type;
    var farm = createShipment.farm;

    return getAssetRegistry('org.tracefood.model.Shipment').then(function (assetRegistry) {
        return assetRegistry.getAll().then(function(allShipments) {
            var newId = allShipments.length + 1;
            var newIdPretty = 'SP_' + ('000'+newId).substring(newId.length);
            var shipmentAsset = getFactory().newResource('org.tracefood.model', 'Shipment', newIdPretty);
            shipmentAsset.packingDate = date;
            shipmentAsset.farmer = farmer;
            shipmentAsset.type = type;
            shipmentAsset.listOfFood = [];
            shipmentAsset.farm = farm;
            shipmentAsset.farmName = farm.name;
            shipmentAsset.locations = [farm.location];
            shipmentAsset.addresses = [farm.address];
            return assetRegistry.add(shipmentAsset);
        });
        
    });
}


/**
* Sample transaction
* @param {org.tracefood.model.pack} pack
* @transaction
*/

async function pack(pack) {
    var food = pack.food;
    var shipment = pack.shipment;

    return getAssetRegistry('org.tracefood.model.Food').then(function (foodRegistry) {
        if(!food.shipment) {
            console.log('esta buit, es pot empaquetar');
        }
        food.shipment = shipment;
        return foodRegistry.update(food);
    }).then(function () {
        return getAssetRegistry('org.tracefood.model.Shipment').then(function (assetRegistry) {
            return assetRegistry.exists(shipment.shipmentId).then(function (exists) {
                if(exists) {
                    return assetRegistry.get(shipment.shipmentId).then(function (shipmentToPack) {
                        if(shipmentToPack.type == food.type) {
                            if(food.status == 'HARVESTED') {
                                shipmentToPack.status = 'PACKED';
                                if(shipmentToPack.listOfFood.length != 0) {
                                    shipmentToPack.listOfFood.push(food);    
                                } else {
                                    shipmentToPack.listOfFood = [];
                                    shipmentToPack.listOfFood.push(food);   
                                }
                                return assetRegistry.update(shipmentToPack);
                            } else {
                                throw new Error('No es pot afegir aquest tipus d\'aliment en aquest paquet!');
                            }
                        } else {
                            throw new Error('No es pot empaquetar aquest aliment, no ha estat collit encara');
                        }
                    });
                } else {
                    throw new Error('This shipment is not in the system yet.')
                }
            })
        });
    });
    

}

/**
* Sample transaction
* @param {org.tracefood.model.harvestFood} harvestFood
* @transaction
*/

async function harvestFood(harvestFood) {

    return getAssetRegistry('org.tracefood.model.Food').then(function (assetRegistry) {
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
                throw new Error("This shipment is not in the system yet.");
            }
        });
    });
}

// /**
// * Sample transaction
// * @param {org.tracefood.model.providerPickupFromFarmer} providerPickupFromFarmer
// * @transaction
// */

// async function providerPickupFromFarmer(providerPickupFromFarmer) {

//     return getAssetRegistry('org.tracefood.model.Food').then(function (assetRegistry) {
//         return assetRegistry.exists(providerPickupFromFarmer.food.foodId).then(function (foodExists) {
//             if (foodExists) {
//                 return assetRegistry.get(providerPickupFromFarmer.food.foodId).then(function (foodToUpdate) {
//                     if (foodToUpdate.status !== 'HARVESTED') {
//                         throw new Error('Aliment no llest per recollir o ja recollit');
//                     }

//                     foodToUpdate.provider = providerPickupFromFarmer.provider;
//                     foodToUpdate.state = providerPickupFromFarmer.state;
//                     foodToUpdate.status = 'TRANSIT';
//                     foodToUpdate.pickedUpDate = providerPickupFromFarmer.date;

//                     return assetRegistry.update(foodToUpdate);
//                 })

//             } else {
//                 throw new Error("Aquest aliment no esta registrat encara.");
//             }
//         });
//     });
// }

/**
* Sample transaction
* @param {org.tracefood.model.providerPickupFromFarmer} providerPickupFromFarmer
* @transaction
*/

async function providerPickupFromFarmer(providerPickupFromFarmer) {

    return getAssetRegistry('org.tracefood.model.Shipment').then(function (assetRegistry) {
        return assetRegistry.exists(providerPickupFromFarmer.shipment.shipmentId).then(function (shipmentExists) {
            if (shipmentExists) {
                return assetRegistry.get(providerPickupFromFarmer.shipment.shipmentId).then(function (shipmentToUpdate) {
                    if (shipmentToUpdate.status !== 'PACKED') {
                        throw new Error('Paquet no llest per recollir o ja recollit');
                    }

                    for(var i = 0; i < shipmentToUpdate.listOfFood.length; i++) {
                        shipmentToUpdate.listOfFood[i].pickedUpDate = providerPickupFromFarmer.date;
                        shipmentToUpdate.listOfFood[i].status = 'TRANSIT';
                    }
                    shipmentToUpdate.provider = providerPickupFromFarmer.provider;
                    //shipmentToUpdate.state = providerPickupFromFarmer.state;
                    shipmentToUpdate.status = 'TRANSIT';
                    shipmentToUpdate.pickedUpDate = providerPickupFromFarmer.date;

                    return getAssetRegistry('org.tracefood.model.Food').then(function (foodRegistry) {
                        return foodRegistry.updateAll(shipmentToUpdate.listOfFood);
                    }).then(function () {
                        return assetRegistry.update(shipmentToUpdate);
                    })

                })

            } else {
                throw new Error("This shipment is not in the system yet.");
            }
        });
    });
}

// /**
// * Sample transaction
// * @param {org.tracefood.model.storeInWarehouse} storeInWarehouse
// * @transaction
// */

// async function storeInWarehouse(storeInWarehouse) {

//     return getAssetRegistry('org.tracefood.model.Food').then(function (assetRegistry) {
//         return assetRegistry.exists(storeInWarehouse.food.foodId).then(function (foodExists) {
//             if (foodExists) {
//                 return assetRegistry.get(storeInWarehouse.food.foodId).then(function (foodToUpdate) {
//                     if (foodToUpdate.status !== 'TRANSIT') {
//                         throw new Error('Aliment no es pot emmagatzemar');
//                     }

//                     foodToUpdate.state = storeInWarehouse.state;
//                     foodToUpdate.warehouse = storeInWarehouse.warehouse;
//                     foodToUpdate.status = 'STORED';
//                     foodToUpdate.enterWarehouseDate = storeInWarehouse.date;

//                     return assetRegistry.update(foodToUpdate);
//                 })
//             } else {
//                 throw new Error("Aquest aliment no esta registrat encara.");
//             }
//         });
//     });
// }

/**
* Sample transaction
* @param {org.tracefood.model.storeInWarehouse} storeInWarehouse
* @transaction
*/

async function storeInWarehouse(storeInWarehouse) {
    var warehouse = storeInWarehouse.warehouse;

    return getAssetRegistry('org.tracefood.model.Shipment').then(function (assetRegistry) {
        return assetRegistry.exists(storeInWarehouse.shipment.shipmentId).then(function (shipmentExists) {
            if (shipmentExists) {
                return assetRegistry.get(storeInWarehouse.shipment.shipmentId).then(function (shipmentToUpdate) {
                    if (shipmentToUpdate.status !== 'TRANSIT') {
                        throw new Error('Aliment no es pot emmagatzemar');
                    }

                    for(var i = 0; i < shipmentToUpdate.listOfFood.length; i++) {
                        shipmentToUpdate.listOfFood[i].enterWarehouseDate = storeInWarehouse.date;
                        shipmentToUpdate.listOfFood[i].status = 'STORED';
                        shipmentToUpdate.listOfFood[i].addresses.push(warehouse.address);
                        shipmentToUpdate.listOfFood[i].locations.push(warehouse.location);
                        shipmentToUpdate.listOfFood[i].warehouse = warehouse;
                        shipmentToUpdate.listOfFood[i].warehouseName = warehouse.name;
                    }

                    //shipmentToUpdate.state = storeInWarehouse.state;
                    shipmentToUpdate.warehouse = warehouse;
                    shipmentToUpdate.status = 'STORED';
                    shipmentToUpdate.enterWarehouseDate = storeInWarehouse.date;
                    shipmentToUpdate.warehouseName = warehouse.name;
                    shipmentToUpdate.addresses.push(warehouse.address);
                    shipmentToUpdate.locations.push(warehouse.location);

                    return getAssetRegistry('org.tracefood.model.Food').then(function (foodRegistry) {
                        return foodRegistry.updateAll(shipmentToUpdate.listOfFood);
                    }).then(function () {
                        return assetRegistry.update(shipmentToUpdate);
                    })
                })
            } else {
                throw new Error("This shipment is not in the system yet.");
            }
        });
    });
}

// /**
// * Sample transaction
// * @param {org.tracefood.model.pickedUpFromWarehouse} pickedUpFromWarehouse
// * @transaction
// */
// async function pickedUpFromWarehouse(pickedUpFromWarehouse) {

//     return getAssetRegistry('org.tracefood.model.Food').then(function (assetRegistry) {
//         return assetRegistry.exists(pickedUpFromWarehouse.food.foodId).then(function (foodExists) {
//             if (foodExists) {
//                 return assetRegistry.get(pickedUpFromWarehouse.food.foodId).then(function (foodToUpdate) {
//                 if (foodToUpdate.status !== 'STORED') {
//                     throw new Error('Aliment no es pot emmagatzemar');
//                 }

//                 if (foodToUpdate.warehouse.warehouseId != pickedUpFromWarehouse.warehouse.warehouseId) {
//                     throw new Error('Ep, estas recollint un aliment que te registrat un magatzem diferent on s\'esta recollint!');
//                 }
//                 foodToUpdate.state = pickedUpFromWarehouse.state;
//                 foodToUpdate.status = 'TRANSIT';
//                 foodToUpdate.pickedUpFromWarehouse = pickedUpFromWarehouse.date;

//                 return assetRegistry.update(foodToUpdate);
//             })
//             } else {
//                 throw new Error("Aquest aliment no esta registrat encara.");
//             }
//         });
//     });
// }

/**
* Sample transaction
* @param {org.tracefood.model.pickedUpFromWarehouse} pickedUpFromWarehouse
* @transaction
*/
async function pickedUpFromWarehouse(pickedUpFromWarehouse) {

    return getAssetRegistry('org.tracefood.model.Shipment').then(function (assetRegistry) {
        return assetRegistry.exists(pickedUpFromWarehouse.shipment.shipmentId).then(function (shipmentExists) {
            if (shipmentExists) {
                return assetRegistry.get(pickedUpFromWarehouse.shipment.shipmentId).then(function (shipmentToUpdate) {
                if (shipmentToUpdate.status !== 'STORED') {
                    throw new Error('Paquet no es pot recollir');
                }
                for(var i = 0; i < shipmentToUpdate.listOfFood.length; i++) {
                    shipmentToUpdate.listOfFood[i].pickedUpFromWarehouse = providerPickupFromFarmer.date;
                    shipmentToUpdate.listOfFood[i].status = 'TRANSIT';
                }
                // console.log(shipmentToUpdate.warehouse.warehouseId);
                // console.log(pickedUpFromWarehouse.warehouse.warehouseId);
                // if (shipmentToUpdate.warehouse.warehouseId != pickedUpFromWarehouse.warehouse.warehouseId) {
                //     throw new Error('Ep, estas recollint un paquet que te registrat un magatzem diferent on s\'esta recollint!');
                // }
                // shipmentToUpdate.state = pickedUpFromWarehouse.state;
                shipmentToUpdate.status = 'TRANSIT';
                shipmentToUpdate.pickedUpFromWarehouse = pickedUpFromWarehouse.date;

                return getAssetRegistry('org.tracefood.model.Food').then(function (foodRegistry) {
                    return foodRegistry.updateAll(shipmentToUpdate.listOfFood);
                }).then(function () {
                    return assetRegistry.update(shipmentToUpdate);
                })
            })
            } else {
                throw new Error("This shipment is not in the system yet.");
            }
        });
    });
}

// /**
// * Sample transaction
// * @param {org.tracefood.model.shopDelivery} shopDelivery
// * @transaction
// */
// async function shopDelivery(shopDelivery) {

//     return getAssetRegistry('org.tracefood.model.Food').then(function (assetRegistry) {
//         return assetRegistry.exists(shopDelivery.food.foodId).then(function (foodExists) {
//             if (foodExists) {
//                 return assetRegistry.get(shopDelivery.food.foodId).then(function (foodToUpdate) {
//                 if (foodToUpdate.status !== 'TRANSIT') {
//                     throw new Error('Aliment no es pot emmagatzemar');
//                 }

//                 if (foodToUpdate.distributor != shopDelivery.distributor) {
//                     throw new Error('Ep, el paquet ha estat recollit per un distribuïdor diferent a qui l\'entrega!');
//                 }
//                 foodToUpdate.state = shopDelivery.state;
//                 foodToUpdate.status = 'TOSELL';
//                 foodToUpdate.shop = shopDelivery.shop;
//                 foodToUpdate.seller = shopDelivery.shop.owner;
//                 foodToUpdate.shopDeliveryDate = shopDelivery.date;

//                 return assetRegistry.update(foodToUpdate);
//             })
//             } else {
//                 throw new Error("Aquest aliment no esta registrat encara.");
//             }
//         });
//     });
// }

/**
* Sample transaction
* @param {org.tracefood.model.shopDelivery} shopDelivery
* @transaction
*/
async function shopDelivery(shopDelivery) {
    var shop = shopDelivery.shop;

    return getAssetRegistry('org.tracefood.model.Shipment').then(function (assetRegistry) {
        return assetRegistry.exists(shopDelivery.shipment.shipmentId).then(function (shipmentExists) {
            if (shipmentExists) {
                return assetRegistry.get(shopDelivery.shipment.shipmentId).then(function (shipmentToUpdate) {
                if (shipmentToUpdate.status !== 'TRANSIT') {
                    throw new Error('Aliment no es pot emmagatzemar');
                }
                for(var i = 0; i < shipmentToUpdate.listOfFood.length; i++) {
                    shipmentToUpdate.listOfFood[i].shopDeliveryDate = shopDelivery.date;
                    shipmentToUpdate.listOfFood[i].status = 'TOSELL';
                    shipmentToUpdate.listOfFood[i].addresses.push(shop.address);
                    shipmentToUpdate.listOfFood[i].locations.push(shop.location);
                    shipmentToUpdate.listOfFood[i].shop = shop;
                    shipmentToUpdate.listOfFood[i].shopName = shop.name;
                }

                // if (foodToUpdate.distributor != shopDelivery.distributor) {
                //     throw new Error('Ep, el paquet ha estat recollit per un distribuïdor diferent a qui l\'entrega!');
                // }
                // shipmentToUpdate.state = shopDelivery.state;
                shipmentToUpdate.status = 'ONSTORE';
                shipmentToUpdate.shop = shop;
                shipmentToUpdate.seller = shop.owner;
                shipmentToUpdate.shopName = shop.name;
                shipmentToUpdate.shopDeliveryDate = shopDelivery.date;

                return getAssetRegistry('org.tracefood.model.Food').then(function (foodRegistry) {
                    return foodRegistry.updateAll(shipmentToUpdate.listOfFood);
                }).then(function () {
                    return assetRegistry.update(shipmentToUpdate);
                })
            })
            } else {
                throw new Error("This shipment is not in the system yet.");
            }
        });
    });
}


/**
* Sample transaction
* @param {org.tracefood.model.foodSold} foodSold
* @transaction
*/
async function foodSold(foodSold) {

    return getAssetRegistry('org.tracefood.model.Food').then(function (assetRegistry) {
        return assetRegistry.exists(foodSold.food.foodId).then(function (foodExists) {
            if (foodExists) {
                return assetRegistry.get(foodSold.food.foodId).then(function (foodToUpdate) {
                if (foodToUpdate.status !== 'TOSELL') {
                    throw new Error('Aliment no es pot emmagatzemar');
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
/**
* Sample transaction
* @param {org.tracefood.model.shipmentSold} shipmentSold
* @transaction
*/
async function shipmentSold(shipmentSold) {

    return getAssetRegistry('org.tracefood.model.Shipment').then(function (assetRegistry) {
        return assetRegistry.exists(shipmentSold.shipment.shipmentId).then(function (shipmentExists) {
            if (shipmentExists) {
                return assetRegistry.get(shipmentSold.shipment.shipmentId).then(function (shipmentToUpdate) {
                if (shipmentToUpdate.status !== 'ONSTORE') {
                    throw new Error('Aliment no es pot emmagatzemar');
                }

                shipmentToUpdate.state = shipmentSold.state;
                shipmentToUpdate.status = 'SOLD';
                shipmentToUpdate.shopDeliveryDate = shipmentSold.date;

                return assetRegistry.update(shipmentToUpdate);
            })
            } else {
                throw new Error("This shipment is not in the system yet.");
            }
        });
    });
}



