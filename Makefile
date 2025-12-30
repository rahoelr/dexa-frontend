DC = docker compose

.PHONY: up up-d down build rebuild ps logs restart clean up-api up-api-d

up:
	$(DC) up

up-d:
	$(DC) up -d

build:
	$(DC) build

rebuild:
	$(DC) build && $(DC) up -d

down:
	$(DC) down

ps:
	$(DC) ps

logs:
	$(DC) logs -f web

restart:
	$(DC) down && $(DC) up -d

clean:
	$(DC) down -v

up-api:
	VITE_API_BASE_URL=$(API) $(DC) up

up-api-d:
	VITE_API_BASE_URL=$(API) $(DC) up -d
