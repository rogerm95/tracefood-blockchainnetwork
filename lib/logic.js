

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.example.plantFood} plantFood
 * @transaction
 */
async function plantFood(plantFood) {

    var grower = plantFood.grower;
    var product = plantFood.type;

    return getAssetRegistry('org.example.model.food').then(function (assetRegistry) {
        var foodAsset = getFactory().newResource('org.example.model', 'food', 'LE_001');
        foodAsset.type = product;
        foodAsset.plantDate = new Date();
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
