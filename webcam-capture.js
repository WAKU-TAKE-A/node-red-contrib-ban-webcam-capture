const NodeWebcam = require("node-webcam");

module.exports = function (RED) {
  function WebcamCapture(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    let webcam = null; // Create the camera instance only once during initialization

    node.on("input", function (msg) {
      // Create the webcam instance on the first input
      if (!webcam) {
        const camOptions = {
          width: msg.width || 640,             // Width
          height: msg.height || 480,           // Height
          device: msg.id || "",                // Device ID
          callbackReturn: msg.callbackReturn || "buffer",  // Callback return type (default: buffer)
          quality: msg.quality || 90,          // Image quality (default: 90)
          frames: msg.frames || 30,            // Frame rate (default: 30)
          delay: msg.delay || 0,               // Delay (default: 0)
          output: msg.output || "jpeg"         // Output format (default: jpeg)
        };
        webcam = NodeWebcam.create(camOptions);
      }

      // Perform the capture
      webcam.capture("temp", function (err, data) {
        if (err) {
          msg.payload = null;
          msg.error = "Error capturing image: " + err;
          node.send(msg);
          return;
        }
        msg.payload = data;
        msg.error = null;
        node.send(msg);
      });
    });
  }

  RED.nodes.registerType("webcam-capture", WebcamCapture);
};
