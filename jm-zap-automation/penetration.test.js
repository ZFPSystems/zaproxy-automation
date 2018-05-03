(function() {
  'use strict';

  var async = require("async"); //Declare objects.
  var options = {
    proxy: 'http://localhost:8080'
  };
  var ZapClient = require('zaproxy');
  var zaproxy = new ZapClient(options);
  var fs = require('fs');
  var co = require('co');
  var prompt = require('co-prompt');
  var http = require('http');
  var https = require('https');
  var exec = require('child_process').exec;
  var _progress = require('cli-progress');
  var address = null; // Global address value

  co(function*() { //-----------------------------------------------------------Using generators to 'sequentially' execute script.
    try{
      yield* setAddress();      // Yield waits for function return before proceeding.
      yield checkAddress();     // Functions are internally wrapped in callbacks so function does not retun until callback signals complete.
      yield startApplication();
      yield* promptUser(); // Used 'yield*' to hand off generator control to nested yield
      yield setContext();
      yield setScope();
      yield startSpider();
      yield checkSpider();
      yield startScanner();
      yield checkScanner();
      yield printReport();
      yield cleanUp();
    } catch (err){
      onError(err);
    }
  }).catch(onError);


  function* setAddress() { //---------------------------------------------------Prompt user for address and confirmation. If linux, remind to set permissions.
    console.log("--------------------------------------------------------------------------------");
    console.log("-------->              Automated Penetration Test Script              <---------");
    console.log("--------------------------------------------------------------------------------");
    console.log("---------WARNING! IT IS ILLEGAL TO ATTACK A WEBSITE WITHOUT PERMISSION!---------");
    console.log("--------------------------------------------------------------------------------");

    if (process.platform == 'linux' || process.platform == 'darwin') {
      console.log("---> OS detected as Linux based. Please ensure /resources/ZAP_2.5.0/zap.sh <----");
      console.log("---> has execute permissions before continuing!                            <----");
      console.log("--------------------------------------------------------------------------------");
    }
    address = yield prompt('Enter FULL root address of the site you wish to attack (ex. https://iconqa.marc-hi.ca): ');
    var confirmation = yield prompt.confirm("Are you sure you wish to attack '" + address + "'? ");
    if (confirmation === false) {
      throw new Error("Confirmation denied. Aborting script.");
    } else {
      return;
    }
  }

  function checkAddress() { //--------------------------------------------------Check if supplied address is reachable.
    return function(done) {
      console.log("Checking if '" + address + "' is reachable...");
      if (address.startsWith("http://")) { // Depending on http or https, make a test request to address
        http.get(address, function(res) {
          console.log("...done!.");
          done(null, true);
        }).on('error', function(err) {
          throw new Error("Address is unreachable. Aborting Script.");
        });
      } else if (address.startsWith("https://")) {
        https.get(address, function(res) {
          console.log("...done.");
          done(null, true);
        }).on('error', function(err) {
          throw new Error("Address is unreachable. Aborting Script.");
        });
      } else {
        throw new Error("Address is not in the 'http(s)://' format. Aborting Script.");
      }
    }
  }

  function startApplication() { //----------------------------------------------Start the ZAP application.
    return function(done) {
      var d = new Date();
      console.log("Starting ZAP application...");
      if (process.platform == 'win32') {
        exec("zap.bat -daemon -config api.disablekey=true -newsession " + d.getTime(), {  // Create child process with session labelled with timestamp
          cwd: 'resources/ZAP_2.5.0/'
        }, (err, stdout, stderr) => {
          if (err) {
            throw new Error("ZAP child process start error. Check Java verison! Aborting Script." + err);
          }
        });
      } else if (process.platform == 'linux' || process.platform == 'darwin') {
        exec("./zap.sh -daemon -config api.disablekey=true -newsession " + d.getTime(), {
          cwd: 'resources/ZAP_2.5.0/'
        }, (err, stdout, stderr) => {
          if (err) {
            throw new Error("ZAP child process start error. Check Java version and execute permissions on zap.sh! Aborting Script." + err);
          }
        });
      } else {
        throw new Error("Platform is not supported. Aborting.");
      }

      async.retry({
        times: 5,
        interval: 5000
      }, function(callback, results) { // Check if app has started by calling version check on api.
        zaproxy.core.version(function(err, resp) { // Using async retry loop to keep checking status until up.
          if (err) {
            callback(err, null);
          } else {
            callback(null, resp);
          }
        })
      }, function(err, results) {
        if (!err) {
          console.log("...done.");
          done(null, true);
        } else {
          throw new Error("Unable to determine if ZAP child process is up. Aborting");
        }
      });
    }
  }

  function* promptUser() { //---------------------------------------------------Prompt the user to explore the site under proxy.
    console.log("---------------------------------------------------------------------------------");
    console.log("--> Explore the website using a web browser proxied through ZAP at this time. <--");
    console.log(" Ensure every page, authentication wall, and button is accessed for best resuts! ");
    console.log("---------------------------------------------------------------------------------");
    var anyKey = yield prompt('Hit Enter ONLY when you have FULLY completed proxied browsing.');
    console.log("Manual Browsing Completed.");
    return;
  }

  function setContext() { //----------------------------------------------------Set scanning context.
    return function(done) {
      var regexAddress = address.concat(".*");
      console.log("Setting context...");
      zaproxy.context.includeInContext('Default Context', regexAddress, function(err, resp) {
        if (err) {
          throw new Error("Context Set Failed." + err);
        } else {
          console.log("...done.");
          done(null, true);
        }
      });
    }
  }

  function setScope() { //------------------------------------------------------Set scanning scope.
    return function(done) {
      var regexAddress = address.concat(".*"); // Scope address requrires regex
      console.log("Setting scope...");
      zaproxy.context.setContextInScope('Default Context', true, function(err, resp) {
        if (err) {
          throw new Error("Scope Set Failed." + err);
        } else {
          console.log("...done.");
          done(null, true);
        }
      });
    }
  }

  function startSpider() { //---------------------------------------------------Start spider.
    return function(done) {
      console.log("Starting spider...");
      zaproxy.spider.scan(address, 0, function(err, resp) {
        if (err) {
          throw new Error("Spider Start Failed." + err);
        } else {
          console.log("...done.");
          done(null, true);
        }
      });
    }
  }

  function checkSpider() { //---------------------------------------------------Check for spider status. Loop until complete.
    return function(done) {
      console.log("Waiting for spider to complete...");
      var status = "0";

      async.until( // Using async.until loop to keep checking status until complete.
        function() {
          return status == "100";
        },
        function(callback) {
          zaproxy.spider.status(0, function(err, resp) {
            status = resp.status;
            callback();
          });
        },
        function(err) {
          if (!err) {
            console.log("...done.");
            done(null, true);
          } else {
            throw new Error("Spider Scan Error.");
          }
        }
      );
    }
  }

  function startScanner() { //--------------------------------------------------Start scanner.
    return function(done) {
      console.log("Starting active scanner...");
      zaproxy.ascan.scan(address, true, true, "Default Policy", "", "", function(err, resp) {
        if (err) {
          console.log(err);
          throw new Error("Active Scan Start Failed." + err);
        } else {
          console.log("...done.");
          done(null, true);
        }
      });
    }
  }

  function checkScanner() { //--------------------------------------------------Check for scanning status. Loop until complete.
    return function(done) {
      console.log("Waiting for active scanner to complete...");
      var status = "0";
      var bar = new _progress.Bar({
        format: 'Scan progress [{bar}] {percentage}%'
      });
      bar.start(100, 0);

      async.until( // Using async.until loop to keep checking status until complete.
        function() {
          return status == "100";
        },
        function(callback) {
          zaproxy.ascan.status(0, function(err, resp) {
            status = resp.status;
            bar.update(status);
            callback();
          });
        },
        function(err) {
          if (!err) {
            bar.stop();
            console.log("...done.");
            done(null, true);
          } else {
            throw new Error("Active Scan Check Failed.");
          }
        }
      );
    }
  }

  function printReport() { //---------------------------------------------------Print Report.
    return function(done) {
      console.log("Generating report...");
      zaproxy.core.htmlreport(function(err, resp) { // Generate report
        if (err) {
          throw new Error("ZAP Report Generation Failed."  + err);
        } else {
          fs.writeFile('zap-test-report.html', resp, function(err) { // Print report to file
            if (!err) {
              console.log("...done.");
              console.log("Report has been generated to: zap-test-report.html");
              done(null, true);
            } else {
              throw new Error("Report Save Failed." + err);
            }
          });
        }
      });
    }
  }

  function cleanUp() { //-------------------------------------------------------Once complete, call the onError function to kill child and exit script.
    console.error("Cleaning up...");
    onError();
  }

  function onError(err) { //----------------------------------------------------Print error then kill ZAP process.
    if (err) {
      console.error(err);
    } else {
      console.log("...done. Script exiting.");
    }
    if (exec.connected) {
      exec.kill();
    }
    process.exit();
  }

}());
