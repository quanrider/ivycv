import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IvyCV — Viết CV chuẩn các trường đại học hàng đầu thế giới',
  description:
    'Tham khảo mẫu CV có chú thích từ Harvard, MIT, Stanford, Oxford, Cambridge, ETH Zurich. Chỉnh sửa trực tiếp, trợ lý AI theo chuẩn từng trường và xuất PDF chuẩn ATS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
