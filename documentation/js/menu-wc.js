'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">splitexpenses documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' : 'data-target="#xs-components-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' :
                                            'id="xs-components-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' }>
                                            <li class="link">
                                                <a href="components/AddExpenseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddExpenseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AlertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DebtsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DebtsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DebtsDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DebtsDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExpensesListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpensesListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsBackupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsBackupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsCurrencyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsCurrencyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsGraphComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsTravelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsTravelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsUploadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsUploadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsWeatherComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsWeatherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatisticsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SummarygraphComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SummarygraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WeatherComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WeatherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WeatherforecastComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WeatherforecastComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' : 'data-target="#xs-injectables-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' :
                                        'id="xs-injectables-links-module-AppModule-1d3d27a1029bb60e436e998fdd526db2d7aee573103ff8e8e6e86bb51a3c255c5795ff1017f1b0f4405d2f44a7c47a1646a10359cc7bc3fedfc2bc028ec6d0bb"' }>
                                        <li class="link">
                                            <a href="injectables/CurrencyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurrencyService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DebtsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DebtsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ExpensesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpensesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalstorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalstorageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WeatherService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WeatherService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UsersModule-a0af7d4a1cf4b404bd69b6b0e1ec38fd88928b1c7cdb5d8630d61fd158bd1b740c8de201814f55425c26172b7581de665d07b87d9ba5732bf2a1a9cb9f1f789b"' : 'data-target="#xs-components-links-module-UsersModule-a0af7d4a1cf4b404bd69b6b0e1ec38fd88928b1c7cdb5d8630d61fd158bd1b740c8de201814f55425c26172b7581de665d07b87d9ba5732bf2a1a9cb9f1f789b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersModule-a0af7d4a1cf4b404bd69b6b0e1ec38fd88928b1c7cdb5d8630d61fd158bd1b740c8de201814f55425c26172b7581de665d07b87d9ba5732bf2a1a9cb9f1f789b"' :
                                            'id="xs-components-links-module-UsersModule-a0af7d4a1cf4b404bd69b6b0e1ec38fd88928b1c7cdb5d8630d61fd158bd1b740c8de201814f55425c26172b7581de665d07b87d9ba5732bf2a1a9cb9f1f789b"' }>
                                            <li class="link">
                                                <a href="components/UsersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersRoutingModule.html" data-type="entity-link" >UsersRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ExpensesForm.html" data-type="entity-link" >ExpensesForm</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CurrencyService.html" data-type="entity-link" >CurrencyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DebtsService.html" data-type="entity-link" >DebtsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExpensesService.html" data-type="entity-link" >ExpensesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalstorageService.html" data-type="entity-link" >LocalstorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeatherService.html" data-type="entity-link" >WeatherService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Clouds.html" data-type="entity-link" >Clouds</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Coord.html" data-type="entity-link" >Coord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrencyPlugin.html" data-type="entity-link" >CurrencyPlugin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Datagraph.html" data-type="entity-link" >Datagraph</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Debt.html" data-type="entity-link" >Debt</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Expense.html" data-type="entity-link" >Expense</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpenseTypes.html" data-type="entity-link" >ExpenseTypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphPlugin.html" data-type="entity-link" >GraphPlugin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IndividualDebt.html" data-type="entity-link" >IndividualDebt</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Main.html" data-type="entity-link" >Main</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Settings.html" data-type="entity-link" >Settings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StorageData.html" data-type="entity-link" >StorageData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Sys.html" data-type="entity-link" >Sys</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Travel.html" data-type="entity-link" >Travel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserState.html" data-type="entity-link" >UserState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Weather.html" data-type="entity-link" >Weather</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeatherObject.html" data-type="entity-link" >WeatherObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeatherPlugin.html" data-type="entity-link" >WeatherPlugin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Wind.html" data-type="entity-link" >Wind</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});