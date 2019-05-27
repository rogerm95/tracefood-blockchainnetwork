

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

    var grower = plantFood.grower;
    var product = plantFood.type;
    var date = plantFood.date

    return getAssetRegistry('org.example.model.Food').then(function (assetRegistry) {
        var foodAsset = getFactory().newResource('org.example.model', 'Food', 'LE_001');
        foodAsset.type = product;
        foodAsset.plantDate = date;
        foodAsset.grower = grower;
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
    //  var location = getFactory().newConcept('org.example.model', 'Location');
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




