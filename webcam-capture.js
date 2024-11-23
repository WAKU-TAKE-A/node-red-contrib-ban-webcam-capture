const NodeWebcam = require("node-webcam");

module.exports = function (RED) {
  function WebcamCapture(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    let webcam = null;  // 初期化時にカメラを一度だけ作成

    node.on("input", function (msg) {
      // 初回のみカメラのインスタンスを作成
      if (!webcam) {
        const camOptions = {
          width: msg.width || 640,
          height: msg.height || 480,
          device: msg.id || "",
          callbackReturn: "buffer"  // バイナリで取得
        };
        webcam = NodeWebcam.create(camOptions);
      }

      // キャプチャを実行
      webcam.capture("temp", function (err, data) {
        if (err) {
          msg.payload = null;
          node.send(msg);
          node.error("Error capturing image: " + err, msg);
          return;
        }
        msg.payload = data; // バイナリデータを出力
        node.send(msg);
      });
    });
  }

  RED.nodes.registerType("webcam-capture", WebcamCapture);
};