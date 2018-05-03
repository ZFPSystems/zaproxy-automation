# ZAP Automated Penetration Testing

Node.js script for automated testing using the OWASP ZAP tool, which is an integrated penetration testing tool for finding vulnerabilities in web applications.


## Getting Started

To get you started you can simply clone this repository, install the dependencies, and set your browser up to proxy through ZAP.

### Prerequisites

You need git to clone this repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to run the script. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

You will also need a minimum of Java 7 to run. You can get it from [https://www.java.com/en/](https://www.java.com/en/).

### Clone Project

Clone the project to source tree

### Install Dependencies

Install dependencies via NPM by running the below command while within the source folder.  
```
npm install
```

### Proxy Browser

Navigate to `.../resources/`and import the `owasp_zap_root_ca.cer` certificate into your browser. This will allow HTTPS requests to be routed though ZAP.
Next, adjust the browser's proxy settings to point to `localhost:8080`. If you are using Chrome browser, use an extension like SwitchySharp.

### Run the Application

```
npm test
```
Results output to "```zap-test-report.html```"
