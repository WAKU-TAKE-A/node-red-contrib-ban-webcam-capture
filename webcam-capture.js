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
          width: msg.width || 640,             // 幅
          height: msg.height || 480,           // 高さ
          device: msg.id || "",                // デバイスID
          callbackReturn: msg.callbackReturn || "buffer",  // コールバック戻り値形式
          quality: msg.quality || 90,           // 画質（デフォルト: 90）
          frames: msg.frames || 30,            // フレームレート（デフォルト: 30）
          delay: msg.delay || 0,               // ディレイ（デフォルト: 0）
          output: msg.output || "jpeg"         // 出力形式（デフォルト: jpeg）
        };
        webcam = NodeWebcam.create(camOptions);
      }

      // キャプチャを実行
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