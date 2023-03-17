var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","component":"MainComponent","pathMatch":"full"},{"path":"expense","component":"AddExpenseComponent"},{"path":"debts/:id","component":"DebtsDetailComponent"},{"path":"details","component":"ExpensesListComponent"},{"path":"statistics","component":"StatisticsComponent"},{"path":"forecast","component":"WeatherforecastComponent"},{"path":"settings","component":"SettingsComponent","children":[{"path":"","redirectTo":"currency","pathMatch":"full"},{"path":"currency","component":"SettingsCurrencyComponent"},{"path":"travel","component":"SettingsTravelComponent"},{"path":"weather","component":"SettingsWeatherComponent"},{"path":"graph","component":"SettingsGraphComponent"},{"path":"backup","component":"SettingsBackupComponent"},{"path":"upload","component":"SettingsUploadComponent"}]},{"path":"users","loadChildren":"./users/users.module#UsersModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/users/users-routing.module.ts","module":"UsersRoutingModule","children":[{"path":"","component":"UsersComponent"}],"kind":"module"}],"module":"UsersModule"}]}],"kind":"module"}]}
