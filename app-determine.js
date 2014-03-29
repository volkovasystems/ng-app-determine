try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "appDetermine",
		[
			"jquery",
			"angular"
		],
		function construct( ){
			/*
				This will determine if the page has a master app.

				A page can only have one master app, and this master app
					should dominate any modules binded using angular.
			*/
			var htmlElement = $( "html" );
			var appSpecificName = htmlElement.attr( "app-name" );
			var masterApp;
			if( appSpecificName ){
				masterApp = angular.module( appSpecificName, [ ] );
				htmlElement.addClass( "bootstrapped" );
				htmlElement.attr( "ng-bound-app", appSpecificName );
			}

			var appDetermine = function appDetermine( appNamespace, component ){
				//We have a master app and we're trying to boostrap an app to a component.
				if( appSpecificName && component ){
					throw new Error( "cannot override master app" );
				}

				if( typeof component == "string" ){
					component = $( component );
				}
				if( component instanceof jQuery 
					&& component.length == 1 )
				{
					component.ready( function onReady( ){
						angular.bootstrap( component, [ appNamespace ] );
						component.addClass( "bootstrapped" );
						component.attr( "ng-bound-app", appNamespace );
					} );
				}

				if( appSpecificName ){
					return masterApp;
				}

				//We don't have anything so we cannot do anything either.
				if( !appNamespace && !appSpecificName ){
					throw new Error( "cannot determine angular app" );
				}

				//We don't have a master app but we have an app specific namespace.
				return angular.module( appNamespace ); 
			};

			base.appDetermine = appDetermine;
			return appDetermine;
		} );
} )( base );