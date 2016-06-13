'use strict';

const BbPromise = require('bluebird');

const validateInput       = require('./lib/validateInput');
const initializeResources = require('./lib/initializeResources');
const createResourceGroup = require('./lib/createResourceGroup');
const deployFunctions     = require('./lib/deployFunctions');
const updateResourceGroup = require('./lib/updateResourceGroup');

class AzureDeploy {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    Object.assign(
      this,
      validateInput,
      initializeResources,
      createResourceGroup,
      deployFunctions,
      updateResourceGroup
    );

    this.hooks = {
      'before:deploy:initializeResources': () => {
        // Todo: Do we need to create instances of classes
        // coming out of the Azure SDK for the following
        // stages to work properly? If so, do that here
      },

      'deploy:initializeResources': () => {
        // Todo: See ./lib/initializeResources, where we
        // have to understand the user's serverless 
        // environment and turn it into a ARM configuration
        return BbPromise.bind(this)
          .then(this.initializeResources);
      },

      'deploy:createProviderStacks': () => {
        // Todo: See ./lib/createResourceGroup. If we want
        // to create a resource group, it should happen in this
        // step.
        //
        // Todo: What if we deploy to an existing resource group?
        // Todo: Do we really need this step? Should we handle this
        // in deploy?
        return BbPromise.bind(this)
          .then(this.createResourceGroup);
      },

      'deploy:deploy': () => {
        // Todo: See ./lib/deployFunctions. This is where rubber
        // hits the road and functions should be deployed to Azure
        // 
        // Todo: How to deal with incremental deployments? To we go
        // with the safe route and always deploy the whole thing, 
        // deleting everything in our way? If not, see
        // ./lib/updateResourceGroup
        // Todo: updateResourceGroup - do we need to do that? If so,
        // do it in ./lib/updateResourceGroup
        return BbPromise.bind(this)
          .then(this.deployFunctions)
          .then(this.updateResourceGroup)
          .then(() => this.serverless.cli.log('Deployment successful!'));
      },
    };
  }
}