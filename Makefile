#########
# Build #
#########

install:
	yarn install
	cd live && yarn install

## Build static files
build:
	cd live && yarn build

##########
# Deploy #
##########

## Install Ansible dependencies
setup:
	ansible-galaxy install -r ansible/requirements.yml -p ansible/roles -f

## Deploy application (demo)
deploy@demo: setup
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_demo

## Deploy application (prod)
deploy@prod: setup
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_prod
