const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

const lambdaFunctionARN='arn:aws:lambda:ap-northeast-1:851725334110:function:nodejs-s3-resize-image';
const invokeParamEvent={
  "Bucket": "resize-image-noel",
  "img": "c7ghd-08bwm-6xxwt.jpg",
  "inputdir": "input/",
  "outputdir": "output/"
}
const client = new LambdaClient({
  region: "ap-northeast-1",
});

const invoke = async (funcName, payload) => {

  const command = new InvokeCommand({
    FunctionName: funcName,
    Payload: JSON.stringify(payload),
  });

  try {
    // コマンドを送信し、結果を待つ
    const { Payload, LogResult } = await client.send(command);

    // 結果とログを文字列に変換
    const result = Payload ? Buffer.from(Payload).toString() : 'No payload';
    const logs = LogResult ? Buffer.from(LogResult, "base64").toString() : 'No logs';

    return { logs, result };
  } catch (error) {
    // エラーをコンソールに出力
    console.error("Error invoking lambda function:", error);
    // エラーをスローして、さらに上のレベルでキャッチできるようにする
    throw error;
  }
};

invoke(lambdaFunctionARN, invokeParamEvent)
  .then(({ logs, result }) => console.log('Logs:', logs, 'Result:', result))
  .catch(error => console.error('Invocation failed:', error));