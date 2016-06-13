'use strict';

const BbPromise = require('bluebird');
const merge = require('lodash').merge;

class AzureCompileFunctions {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'deploy:compileFunctions': this.compileFunctions.bind(this),
    };
  }

  compileFunctions() {
    if (!this.serverless.service.resources.azure.Resources) {
      throw new this.serverless.Error(
        'This plugin needs access to Resources section of the Azure Resource Manager template');
    }

    this.serverless.service.getAllFunctions().forEach((functionName) => {
      const functionObject = this.serverless.service.getFunction(functionName);
      
      // Todo: Turn single function into something
      // we can deploy on Azure

      // Then, merge into the template
      merge(this.serverless.service.resources.azure.Resources, newFunctionObject);
    });
  }
}

module.exports = AzureCompileFunctions;