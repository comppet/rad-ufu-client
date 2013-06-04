#!/usr/bin/env bash

# Proxy da UFU :/
# export http_proxy=http://proxy.ufu.br:3128/

apt-get update

#
# Apache
#

APACHE_VERSION="2.2.22-1ubuntu1.3"

# Instala o apache e cria link simbólico de '/var/www' para '/vagrant'
apt-get install -y apache2=$APACHE_VERSION
rm -rf /var/www
ln -fs /vagrant /var/www

#
# Nodejs
#

NODEJS_PPA="ppa:chris-lea/node.js"
NODEJS_VERSION="0.10.9-1chl1~precise1"

# Instala o 'add-apt-repository'
apt-get install -y python-software-properties

# Instala o ppa
add-apt-repository -y $NODEJS_PPA
apt-get update

# Instala nodejs e g++ make
apt-get install -y nodejs=$NODEJS_VERSION g++ make

#
# Grunt-cli
#

npm install -g grunt-cli

#
# Git
#

sudo apt-get install -y git

# Instala dependências do RAD-client
cd /vagrant && npm install

# configura o projeto
grunt setup