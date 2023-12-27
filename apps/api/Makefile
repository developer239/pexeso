## Variables ##

BIN := node_modules/.bin
JEST_OVERRIDES := --threads=false
DATASOURCE := src/modules/database/data-source.ts

## Rules ##

infra:
	docker compose up -d --force-recreate

infra-stop:
	docker compose stop

install: package.json
	yarn install
	npx husky install

develop:
	NODE_ENV=development npx nest start --watch

compile:
	rm -rf dist
	npx nest build

run: compile
	node -r $(BOOTSTRAP) ${RUN_OPTIONS} ./dist/main.js

test:
	NODE_ENV=test npx vitest ${JEST_OVERRIDES}

test-watch:
	NODE_ENV=test npx vitest --watch ${JEST_OVERRIDES}

coverage:
	NODE_ENV=test npx vitest --coverage ${JEST_OVERRIDES}

format-check:
	npx prettier --check .

lint-check:
	npx eslint --ext ts src

type-check:
	npx tsc --noEmit

format-fix:
	npx prettier --write .

lint-fix:
	npx eslint --ext ts src --fix

seed-database:
	npx env-cmd ts-node -r tsconfig-paths/register ./src/modules/database/seeds/run-seed.ts

migration-generate:
	npx env-cmd ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=$(DATASOURCE) migration:generate src/modules/database/migrations/$(name)

migration-create:
	npx env-cmd ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create src/modules/database/migrations/$(name)
	npx env-cmd -f .env env-cmd -f .env.test ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create src/modules/database/migrations/$(name)

migration-run:
	npx env-cmd ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=$(DATASOURCE) migration:run
	npx env-cmd -f .env env-cmd -f .env.test ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=$(DATASOURCE) migration:run

migration-revert:
	npx env-cmd ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=$(DATASOURCE) migration:revert
	npx env-cmd -f .env env-cmd -f .env.test ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=$(DATASOURCE) migration:revert

schema-drop:
	npx env-cmd ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=$(DATASOURCE) schema:drop
	npx env-cmd -f .env env-cmd -f .env.test ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=$(DATASOURCE) schema:drop

.PHONY: infra
.PHONY: infra-stop
.PHONY: install
.PHONY: develop
.PHONY: compile
.PHONY: run
.PHONY: test
.PHONY: test-watch
.PHONY: coverage
.PHONY: format-check
.PHONY: lint-check
.PHONY: type-check
.PHONY: format-fix
.PHONY: lint-fix
.PHONY: seed-database
.PHONY: migration-generate
.PHONY: migration-create
.PHONY: migration-run
.PHONY: migration-revert
.PHONY: schema-drop
