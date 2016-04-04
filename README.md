# wavemandala

## Table of contents

* [Infrastructure](#Infrastructure)
* [Backend](#Backend)

## Infrastructure:

### DNS

```
@	    A   	45.55.126.214 3600
mail	MX 37	wavemanda.la   60
```

### Stack

* free tls certs from starcom :P
* nginx
* postfix
* redis
* mysql
* prosody
* restund
* gunicorn

### Deploying

```
ansible-playbook --vault-password-file=$(HOME)/.ansible-vault.wavemandala -i provisioning/inventory provisioning/site.yml
```

## Backend

* Python app under `./wavemandala`
* Routes:
 * `https://wavemanda.la/login`
