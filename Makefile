#########
# Build #
#########

install:
	yarn install

## Install Ansible dependencies
install-roles:
	ansible-galaxy install -r ansible/requirements.yml -p ansible/roles -f

## Build static files
build:
	yarn build

watch:
	yarn start

## Run locally
run:
	open http://localhost:8000; php -S 0.0.0.0:8000 -t .

##########
# Deploy #
##########

## Deploy application (demo)
deploy@demo:
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_demo

## Deploy application (prod)
deploy@prod:
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_prod
