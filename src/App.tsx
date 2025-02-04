import Main from "./components/Main";

function App() {
  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* TODO: OGPの設定 */}
        <link href="/dist/styles.css" rel="stylesheet" />
        <title>モアイ翻訳</title>
      </head>
      <body>
        <Main />
      </body>
    </>
  );
}

export default App;
