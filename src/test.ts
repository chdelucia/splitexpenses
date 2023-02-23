// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { MockInstance, ngMocks } from 'ng-mocks';
import { DefaultTitleStrategy, TitleStrategy } from "@angular/router";
import { MockService } from 'ng-mocks';

ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

// auto spy
ngMocks.autoSpy('jasmine');
jasmine.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
