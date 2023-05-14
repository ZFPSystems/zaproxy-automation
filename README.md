# ZAProxy Automated Security Tests Collection

This repository contains a collection of scripts to automate ZAP Security Tests.

## Getting Started

To get started simply clone this repository, then browse each sub-directory for details on how to use each automation tool.

Tools on the project root are usable directly.

If you have an x86_64 system, then you can use this repo in conjunction with my Vagrant Kali-Linux base-box you'll find [here](https://app.vagrantup.com/zfpsystems/boxes/kali-base-x86_64) (there are other images for other architectures too), to have a full automated build environment and deploy of your testing VM.

### Prerequisites

- You need git to clone this repository, obviously. You can get git from [here](http://git-scm.com/).

- Scripts are mostly Python scripts so you'll need a Python interpreter installed and fully working.

- You'll need ZAProxy installed, you can find the latest release [here](https://github.com/zaproxy/zaproxy).

- You'll need Java VM installed.

- Some of the tools require zaproxy installed in a docker container, you can find the docker image [here](https://hub.docker.com/r/owasp/zap2docker-stable/).

  You can install docker on your system following the instructions [here](https://docs.docker.com/install/).

  You can install docker-compose on your system following the instructions [here](https://docs.docker.com/compose/install/).

  You can install docker-machine on your system following the instructions [here](https://docs.docker.com/machine/install-machine/).

On Kali Linux you can quickly install docker with:

```bash
sudo apt-get install docker docker.io
```

And then pull OWASP latest zap docker image with:

```bash
sudo docker pull owasp/zap2docker-stable
```

### Installation

To install the automation tools just clone this repo inside your Kali Linux (or the system you want to use to run ZAProxy):

```bash
git clone https://github.com/zfpsystems/zaproxy-automation
```

I usually test these tools from `/opt/zfpsystems/zaproxy-automation/`, but you can use whatever path you prefer.

Once you have cloned the repo, go to the directory where you have cloned it and run the following command to install all the required Python dependencies:

```bash
cd /opt/zfpsystems/zaproxy-automation/
sudo pip install -r requirements.txt
```

If everything goes well, you should be able to run the tools.

Tools come with different licenses so please check each tool sub-directory for licenses.

### Usage

To use the tools you need to have ZAProxy installed and reachable (aka in your default path on Linux for example).

Then you can run the tools from the command line, for example:

```bash
cd /opt/zfpsystems/zaproxy-automation/
sudo python zap-baseline.py -t https://www.example.com
```

### Recommendations (yeah read them!)

- DO NOT USE ZAProxy or this ZAProxy automation tools collection to hack web sites and web applications you don't own or you don't have a written permission to pen-test.

- I do not assume any responsibilities for your actions, nor for the content of this repository.

- This automation tools collection sole purpose is to help people (especially the ones who can't afford expensive security solutions) to test security of their web applications and web sites to improve the quality and security of this world and not to make it worst!

### How to help this project

If you have ZAProxy automation scripts you want to include in this collection please feel free, here is how to:

- Create a public github.com repository of your tool, for example JohnWayne-zap-automation
- Add your tool, required dependencies and everything is needed to make it work fine in the repository you have created
- Add a README.md file with instructions on how to install and use your automation tool and your name
- Let me know the URL to your repo and I will add it to the autobuild that generates this collection daily. If your automation tool pass the basic working tests then it will be published on this public repository
- Please note: This is a public and open source repository, so do not add copyrighted stuff that won't allow me to publish your automation tools.

Thanks!
[Paolo](https://github.com/pzaino)
