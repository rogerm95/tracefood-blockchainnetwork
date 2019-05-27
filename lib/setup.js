'use strict';

/**
 * Set Up Demo funcion
 * @param {org.example.model.setupDemo} setupDemo
 * @transaction
 */

 async function setupDemo() {
    await createProvider();
    await createGrower();
    await createDistributor();
    await createSeller();
 }

 function createProvider() {
    return getParticipantRegistry('org.example.model.Provider')
        .then(function (participantRegistry) {
            var providerUser = getFactory().newResource('org.example.model', 'Provider', 'PR_001');
            providerUser.companyName = "ProviderOne";
            var address = getFactory().newConcept('org.example.model', 'Address');
            address.country = 'Spain';
            providerUser.address = address;
            var providerUserT = getFactory().newResource('org.example.model', 'Provider', 'PR_002');
            providerUserT.companyName = "ProviderTwo";
            providerUserT.address = address;
            return participantRegistry.addAll([providerUser, providerUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }

 function createGrower() {
    return getParticipantRegistry('org.example.model.Grower')
        .then(function (participantRegistry) {
            var growerUser = getFactory().newResource('org.example.model', 'Grower', 'GR_001');
            growerUser.companyName = "GrowerOne";
            var address = getFactory().newConcept('org.example.model', 'Address');
            address.country = 'Spain';
            growerUser.address = address;
            var growerUserT = getFactory().newResource('org.example.model', 'Grower', 'GR_002');
            growerUserT.companyName = "GrowerTwo";
            growerUserT.address = address;
            return participantRegistry.addAll([growerUser, growerUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }

 function createDistributor() {
    return getParticipantRegistry('org.example.model.Distributor')
        .then(function (participantRegistry) {
            var distUser = getFactory().newResource('org.example.model', 'Distributor', 'DT_001');
            distUser.companyName = "DistributorOne";
            var address = getFactory().newConcept('org.example.model', 'Address');
            address.country = 'Spain';
            distUser.address = address;
            var distUserT = getFactory().newResource('org.example.model', 'Distributor', 'DT_002');
            distUserT.companyName = "DistributorTwo";
            distUserT.address = address;
            return participantRegistry.addAll([distUser, distUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }

 function createSeller() {
    return getParticipantRegistry('org.example.model.Seller')
        .then(function (participantRegistry) {
            var sellerUser = getFactory().newResource('org.example.model', 'Seller', 'GR_001');
            sellerUser.companyName = "SellerOne";
            var address = getFactory().newConcept('org.example.model', 'Address');
            address.country = 'Spain';
            sellerUser.address = address;
            var sellerUserT = getFactory().newResource('org.example.model', 'Seller', 'GR_002');
            sellerUserT.companyName = "SellerTwo";
            sellerUserT.address = address;
            return participantRegistry.addAll([sellerUser, sellerUserT]);
        })
        .catch(function (error) {
            throw new Error(error);
        });
 }