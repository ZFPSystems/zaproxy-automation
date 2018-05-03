# ZAProxy Automated Security Tests Collection
This repository contains a collection of scripts to automate ZAP Security Tests.

## Getting Started

To get started simply clone this repository, then browse each sub-directory for details on how to use each automation tool.

Tools on the project root are usable directly.

You can use this repo in conjunction with the Vagrant Kali-Linux base-box you'll find here: 
https://app.vagrantup.com/zfpsystems/boxes/kali-base-x86_64 

to have a full automated build environment and deploy of your testing VM.

### Prerequisites

- You need git to clone this repository, obviously. You can get git from
  http://git-scm.com/

- Scripts are mostly Python scripts so you'll need a Python interpreter installed and fully working.

- You'll need ZAProxy installed, you can find the latest release here: 
  https://github.com/zaproxy/zaproxy

- You'll need Java VM installed.

### Install
To install the automation tools just clone this repo inside your Kali Linux (or the system you want to use to run ZAProxy):
```
git clone https://github.com/zfpsystems/zaproxy-automation
```

I usually test these tools from /opt/zfpsystems/zaproxy-automaion, but you can use whatever path you prefer.

Tools come with different licenses so please check sub-directory for licenses.

### Reccommendations (yeah read them!)
- DO NOT USE ZAProxy or this ZAProxy automation tools collection to hack web sites and web applications you don't own or you don't have a written permission to pen-test.

- I do not assume any responsabilities for your actions, nor for the content of this repository.

- This automation tools collection sole purpose is to help people (especially the ones who can't afford expensive security solutions) to test security of their web applications and web sites to improve the quality and security of this world and not to make it worst!

### How to help this project
If you have ZAProxy automation scripts you want to include in this collection please feel free, here is how to:

- Create a public github.com repository of your tool, for example JohnWayne-zap-automation
- Add your tool, required dependencies and everything is needed to make it work fine in the repository you have created
- Add a README.md file with instructions on how to install and use your automation tool and your name
- Let me know the URL to your repo and I will add it to the autobuild that generates this collection daily. If your automation tool pass the basic working tests then it will be published on this public repository
- Please note: This is a public and open source repository, so do not add copyrighted stuff that won't allow me to publish your automation tools.

Thanks!

