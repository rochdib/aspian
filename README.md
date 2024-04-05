## Aspian
Aspian is a content management and blogging platform built with ASP.NET Core using clean architecture principles.

## Architecture
The solution is organized into the following projects:

# Aspian.Domain - Contains the core business logic and entities.
# Aspian.Application - Implements use cases and orchestration logic.
# Aspian.Infrastructure - Provides data access implementations.
# Aspian.Web - The presentation layer, containing MVC controllers and views.

The architecture follows the principles of Domain-Driven Design, separating the domain logic from the infrastructure and presentation layers. 
The domain layer contains entities, repositories, services, and domain events. 
The application layer handles coordination and use cases. 
Infrastucture provides implementation concerns like data access. 
The web project is a thin layer, focused on controllers and views.

The domain and application layers in particular make heavy use of abstractions, interfaces, and domain-driven patterns. This keeps the business logic flexible and isolated from specific implementations.

## Key Components
MediatR - Used for application layer request handling pipeline.
Entity Framework Core - Data access to SQL Server database.
AutoMapper - Mapping between domain models and API resource representations.
Serilog - Logging framework.
Swashbuckle - OpenAPI/Swagger documentation generation.
Getting Started
The following steps will get you up and running with the Aspian platform:

Clone the repository
Open solution in Visual Studio 2022
Build solution
Run database migrations
Launch the Aspian.Web project
Navigate to /swagger to view API documentation
