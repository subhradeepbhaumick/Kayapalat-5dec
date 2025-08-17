import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Kayapalat Admin Panel",
  keywords: ["admin", "dashboard", "kayapalat"],
  authors: [{ name: "Kayapalat Team", url: "https://kayapalat.com" }],
  creator: "Kayapalat Team",
  publisher: "Kayapalat Team",
  robots: "noindex, nofollow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kayapalat.com/admin",
    title: "Admin Dashboard", 
    description: "Kayapalat Admin Panel",
    siteName: "Kayapalat",  
    images: [
      {
        url: "https://kayapalat.com/images/logo.png",
        width: 800,
        height: 600,
        alt: "Kayapalat Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Dashboard",
    description: "Kayapalat Admin Panel",
    images: ["https://kayapalat.com/images/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",  
  colorScheme: "light dark",
  viewport: "width=device-width, initial-scale=1.0",
  charset: "UTF-8",
  applicationName: "Kayapalat Admin",
  referrer: "no-referrer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://kayapalat.com/admin",
    languages: {
      "en-US": "/admin",
      "fr-FR": "/admin/fr",
    },
  },  
  robotsTxt: {
    userAgent: "*",
    allow: "/admin",
    disallow: ["/admin/private", "/admin/settings"],
  },
  verification: {
    google: "google-site-verification-code",
    bing: "bing-site-verification-code",
    yandex: "yandex-site-verification-code",
    facebook: "facebook-site-verification-code",
    pinterest: "pinterest-site-verification-code",
    twitter: "twitter-site-verification-code",
    linkedin: "linkedin-site-verification-code",
    reddit: "reddit-site-verification-code",
    baidu: "baidu-site-verification-code",
    apple: "apple-site-verification-code",
    docusign: "docusign-site-verification-code",
    tiktok: "tiktok-site-verification-code",
    snapchat: "snapchat-site-verification-code",  
    whatsapp: "whatsapp-site-verification-code",
    instagram: "instagram-site-verification-code",
    youtube: "youtube-site-verification-code",
    vimeo: "vimeo-site-verification-code",
    tumblr: "tumblr-site-verification-code",
    flickr: "flickr-site-verification-code",
    quora: "quora-site-verification-code",
    medium: "medium-site-verification-code",
    soundcloud: "soundcloud-site-verification-code",
    spotify: "spotify-site-verification-code",
    wordpress: "wordpress-site-verification-code",
    github: "github-site-verification-code",
    gitlab: "gitlab-site-verification-code",
  },
  appLinks: {
    android: "https://kayapalat.com/admin/android",
    ios: "https://kayapalat.com/admin/ios",
    web: "https://kayapalat.com/admin",
  },
  additionalLinkTags: [
    
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
  additionalMetaTags: [
    { name: "theme-color", content: "#ffffff" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "msapplication-config", content: "/browserconfig.xml" },
  ],
  twitterCard: {
    card: "summary_large_image",
    site: "@kayapalat",
    creator: "@kayapalat",
  },
  googleAnalytics: {
    measurementId: "G-XXXXXXXXXX",
  },
  facebookPixel: {
    pixelId: "1234567890",
  },
  tiktokPixel: {
    pixelId: "0987654321",
  },
  pinterestTag: {
    tagId: "1234567890",
  },
  linkedinInsightTag: {
    partnerId: "123456",
  },
  redditPixel: {
    pixelId: "1234567890",
  },
  baiduTongji: {
    siteId: "12345678",
  },
  yandexMetrika: {
    counterId: "12345678",
  },
  docusign: {
    accountId: "1234567890",
  },
  tiktok: {
    pixelId: "1234567890",
  },
  snapchat: {
    pixelId: "1234567890",
  },
  whatsapp: {
    phoneNumber: "+1234567890",
  },
  instagram: {
    username: "kayapalat",
  },
  youtube: {
    channelId: "UC1234567890",
  },
  vimeo: {
    userId: "123456789",
  },
  tumblr: {
    blogName: "kayapalat",
  },
  flickr: {
    userId: "123456789@N01",
  },
  quora: {
    accountId: "1234567890",
  },

  medium: {
    username: "kayapalat",
  },
  soundcloud: {
    userId: "123456789",
  },
  spotify: {
    userId: "123456789",
  },
  wordpress: {
    siteUrl: "https://kayapalat.com",
  },
  github: {
    username: "kayapalat",
  },
  gitlab: {
    username: "kayapalat",
  },
  customMeta: [
    { name: "custom-meta", content: "Custom Meta Content" },
    { property: "custom-property", content: "Custom Property Content" },
  ],
  customLinkTags: []
}; 