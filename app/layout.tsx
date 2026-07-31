import type { Metadata } from "next";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const siteUrl = isGitHubPages
  ? "https://mxwq1313-collab.github.io/shijie-conflict-map/"
  : "https://shijie-conflict-map.russet-koala-6614.chatgpt.site/";
const title = "释结｜非裁判式冲突复盘";
const description = "分开事实与解释，看见双方可能的视角，再决定下一步。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "og.png", width: 1536, height: 1024, alt: "释结：把争吵，慢慢看清楚。" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
