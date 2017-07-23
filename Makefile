#########
# Build #
#########

install:
	yarn install
	cd live && yarn install

## Install Ansible dependencies
install-roles:
	ansible-galaxy install -r ansible/requirements.yml -p ansible/roles -f

## Build static files
build:
	cd live && yarn build

serve:
	cd live && yarn start

##########
# Deploy #
##########

## Deploy application (demo)
deploy@demo:
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_demo

## Deploy application (prod)
deploy@prod:
	ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=deploy_prod
