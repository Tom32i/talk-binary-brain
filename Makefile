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
    ansible-galaxy install -r requirements.yml -p roles -f

## Deploy application (demo)
deploy@demo: setup
    ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=demo

## Deploy application (prod)
deploy@demo: setup
    ansible-playbook ansible/deploy.yml --inventory-file=ansible/hosts --limit=prod
