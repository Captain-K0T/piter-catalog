import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const montserrat = Montserrat_Alternates({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  title: "Вкусный Питер",
  description: "Лучшие рестораны Санкт-Петербурга",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${montserrat.className}`}>
        {children}
      </body>
    </html>
  );
}
