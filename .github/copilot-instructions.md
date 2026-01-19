# AI Coding Agent Instructions for Bread Distribution System

## Project Overview

**bread-distribution-of-eman-bakery** is a distribution logistics system for managing bread inventory and delivery across bakery locations. The project is in early stages.

## Architecture & Key Components

When this project develops, expect:
- **Distribution Logic**: Inventory management and routing algorithms
- **Bakery Operations**: Production scheduling and stock management  
- **Delivery Tracking**: Real-time status and customer notifications
- Cross-domain communication patterns between these components

Refer to individual service READMEs and configuration files (e.g., `config.yml`, `docker-compose.yml`) for service boundaries and data flows.

## Development Workflows

### Setup & Dependencies
- Check for package managers: `package.json` (Node), `requirements.txt` (Python), `Gemfile` (Ruby), `go.mod` (Go)
- Build/run commands will be documented in `Makefile`, `docker-compose.yml`, or npm/cargo scripts
- Environment variables: Look in `.env.example` or `docs/setup.md`

### Testing & Validation
- Run tests before submitting changes
- Location: typically `tests/`, `spec/`, `__tests__/`, or `test_*.py`
- Watch patterns indicate what changed in tests when modifying core logic

### Debugging
- Check `logs/` directory or container logs if containerized
- Configuration files (`.env`, `config/`) control logging verbosity

## Code Patterns & Conventions

### Naming & Structure
- Watch for domain-driven design patterns: services organized by business capability (not by tech layer)
- Entities: bakery, distribution center, delivery routes, inventory
- API endpoints likely organized by resource (e.g., `/api/bakeries`, `/api/deliveries`)

### Data Models
- Inventory tracking: item IDs, quantities, locations, timestamps
- Delivery orders: source, destination, status, timestamp fields
- Relationships between bakeries and distribution centers

### Common Practices
- Configuration via environment variables or `config/` files (not hardcoded)
- Database migrations if applicable: check `db/migrations/` or `schema/`
- Async operations for delivery notifications and status updates

## Integration Points

### External Dependencies
- When discovered: payment gateways, mapping services, inventory APIs
- Document in dependency lists (package manifests or requirements files)
- API authentication: look for `.env` secrets or credential managers

### Cross-Component Communication
- Event patterns or message queues for bakery-to-delivery updates
- REST/GraphQL APIs or gRPC services between components
- Database-driven updates if using shared data layer

## Adding Features & Modules

1. **Identify the service boundary**: Which component does this belong to?
2. **Follow existing patterns**: Match the code style and structure of similar features
3. **Check integration points**: How will this communicate with other services?
4. **Update documentation**: Add examples to README or API docs
5. **Test thoroughly**: Include unit tests and integration tests when applicable

## Important Files (Add as they appear)

- `.env.example` – Environment variable template
- `docker-compose.yml` – Local development setup  
- `Makefile` / `package.json` – Build and test scripts
- `docs/API.md` – API reference
- `docs/ARCHITECTURE.md` – System design details

---

**Last updated**: January 18, 2026  
**Status**: Foundation established; will expand as codebase develops  

*Questions? Check existing issues, architecture docs, or ask the team about current focus areas.*
