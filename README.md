# MERCHANT Microservice

**Creation Date**: 2026-04-11

**Author**: Ing. Persy Morell Guerra e Ing. Dailyn García Dominguez (SoftwarEnTalla CEO)

## Contexto funcional reciente

`merchant-service` publica el estado operativo de la configuración de pasarelas por comercio mediante `merchant-gateway-config`.

Eventos publicados:

- `MerchantGatewayConfigActivated`
- `MerchantGatewayConfigDeactivated`
- `MerchantGatewayConfigUpdated`

## Microservice Structure

```plaintext
.
|____common
| |____database
| |____dto
| | |____args
| | |____inputs
| |____helpers
| |____logger
| |____types
|____config
|____core
| |____adapters
| |____configs
| |____loaders
| |____logs
| |____services
| |____tda
|____errors
|____filters
|____i18n
|____interfaces
|____migrations
|____modules
| |____merchant
| |____merchant-gateway-config
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
|____utils
```
