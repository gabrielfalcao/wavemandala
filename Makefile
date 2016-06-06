WAVEMANDALA_SETTINGS := settings.py
AUDIO_PATH := $(shell pwd)/audio

export WAVEMANDALA_SETTINGS
export AUDIO_PATH

all: tests deploy-everything

prepare-environment: deps

python-deps:
	pip install -r development.txt

js-deps:
	cd wavemandala/static && npm install

deps: python-deps js-deps

deploy-everything:
	ansible-playbook --vault-password-file=$(HOME)/.ansible-vault.wavemandala -i provisioning/inventory provisioning/site.yml

deploy-backend:
	ansible-playbook --vault-password-file=$(HOME)/.ansible-vault.wavemandala -i provisioning/inventory provisioning/site.yml -t backend

deploy-frontend: static
	ansible-playbook --vault-password-file=$(HOME)/.ansible-vault.wavemandala -i provisioning/inventory provisioning/site.yml -t static

static: js-deps
	cd wavemandala/static && webpack --progress --colors

watch:
	cd wavemandala/static && webpack --progress --colors --watch

run:
	PYTHONPATH=$(PYTHONPATH):$(shell pwd) python wavemandala/application.py

edit-vault:
	ansible-vault --vault-password-file=~/.ansible-vault.wavemandala edit provisioning/wavemandala-vault.yml

unit:
	@nosetests --nologcapture -s --with-coverage --cover-erase --cover-package=wavemandala --rednose --verbosity=3 tests/unit

functional:
	@nosetests --nologcapture -s --with-coverage --cover-erase --cover-package=wavemandala --rednose --verbosity=3 tests/functional

tests: unit functional
