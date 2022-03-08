.SILENT:
.PHONY: demo

#########
# Build #
#########

## Install Ansible dependencies
install-roles:
	ansible-galaxy install -r ansible/requirements.yml -p ansible/roles -f

# Install dependencies
install:
	npm install

# Launch watch
watch:
	npx webpack --watch --mode=development

# Build lib
build:
	npx webpack --mode=production

## Run locally
run:
	open http://localhost:8000; php -S 0.0.0.0:8000 -t .

## Run locally
demo:
	open http://localhost:8001; php -S 0.0.0.0:8001 -t ./demo

##########
# Deploy #
##########

## Deploy application (staging)
deploy@staging:
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_demo

## Deploy application (production)
deploy@production:
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_prod
