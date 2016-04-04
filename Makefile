all: deploy

prepare-environment: deps

python-deps:
	pip install -r requirements.txt
js-deps:
	cd wavemandala/static && npm install

deps: python-deps js-deps

deploy: static
	ansible-playbook --vault-password-file=$(HOME)/.ansible-vault.wavemandala -i provisioning/inventory provisioning/site.yml

static: js-deps
	cd wavemandala/static && webpack --progress --colors

watch: js-deps
	cd wavemandala/static && webpack --progress --colors --watch

run:
	PYTHONPATH=$(PYTHONPATH):$(shell pwd) python wavemandala/application.py

edit-vault:
	ansible-vault --vault-password-file=~/.ansible-vault.wavemandala edit provisioning/wavemandala-vault.yml
