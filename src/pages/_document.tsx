import { getCssText } from "@/styles";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Roboto+Mono:wght@700&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <style id="stiches" dangerouslySetInnerHTML={{ __html: getCssText() }} ></style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}