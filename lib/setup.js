'use strict';

/**
 * Set Up Demo funcion
 * @param {org.tracefood.model.setupDemo} setupDemo
 * @transaction
 */

 async function setupDemo() {
    await createProvider();
    await createGrower();
    await createDistributor();
    await createSeller();
 }

 function createProvider() {
    return getParticipantRegistry('org.tracefood.model.Provider')
        .then(function (participantRegistry) {
            var providerUser = getFactory().newResource('org.tracefood.model', 'Provider', 'PR_001');
            providerUser.companyName = "ProviderOne";
            var address = getFactory().newConcept('org.tracefood.base', 'Address');
            address.country = 'Spain';
            providerUser.address = address;
            var providerUserT = getFactory().newResource('org.tracefood.model', 'Provider', 'PR_002');
            providerUserT.companyName = "ProviderTwo";
            providerUserT.address = address;
            return participantRegistry.addAll([providerUser, providerUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }

 function createGrower() {
    return getParticipantRegistry('org.tracefood.model.Farmer')
        .then(function (participantRegistry) {
            var growerUser = getFactory().newResource('org.tracefood.model', 'Farmer', 'GR_001');
            growerUser.companyName = "GrowerOne";
            var address = getFactory().newConcept('org.tracefood.base', 'Address');
            address.country = 'Spain';
            growerUser.address = address;
            var growerUserT = getFactory().newResource('org.tracefood.model', 'Farmer', 'GR_002');
            growerUserT.companyName = "GrowerTwo";
            growerUserT.address = address;
            return participantRegistry.addAll([growerUser, growerUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }

 function createDistributor() {
    return getParticipantRegistry('org.tracefood.model.Distributor')
        .then(function (participantRegistry) {
            var distUser = getFactory().newResource('org.tracefood.model', 'Distributor', 'DT_001');
            distUser.companyName = "DistributorOne";
            var address = getFactory().newConcept('org.tracefood.base', 'Address');
            address.country = 'Spain';
            distUser.address = address;
            var distUserT = getFactory().newResource('org.tracefood.model', 'Distributor', 'DT_002');
            distUserT.companyName = "DistributorTwo";
            distUserT.address = address;
            return participantRegistry.addAll([distUser, distUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }

 function createSeller() {
    return getParticipantRegistry('org.tracefood.model.Seller')
        .then(function (participantRegistry) {
            var sellerUser = getFactory().newResource('org.tracefood.model', 'Seller', 'SE_001');
            sellerUser.companyName = "SellerOne";
            var address = getFactory().newConcept('org.tracefood.base', 'Address');
            address.country = 'Spain';
            sellerUser.address = address;
            var sellerUserT = getFactory().newResource('org.tracefood.model', 'Seller', 'SE_002');
            sellerUserT.companyName = "SellerTwo";
            sellerUserT.address = address;
            return participantRegistry.addAll([sellerUser, sellerUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }