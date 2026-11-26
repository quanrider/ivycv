import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  FileCheck2,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { RecentCvsBar } from '@/components/home/RecentCvsBar';
import { UNIVERSITY_TEMPLATES } from '@/data/universities';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:pt-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-xs">
              <GraduationCap className="h-3.5 w-3.5 text-stone-900" />
              Harvard • MIT • Stanford • Oxford • Cambridge • ETH Zurich
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-5xl sm:leading-[1.12]">
              Viết CV chuẩn các trường đại học hàng đầu thế giới.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
              Không chỉ mượn khung bố cục — hãy xem trực tiếp <strong>họ viết những gì</strong>{' '}
              và <strong>cách họ hành văn, định lượng thành tích</strong> qua kho mẫu có chú
              thích chi tiết, đối chiếu song song khi viết, nhận góp ý từ AI theo đúng chuẩn
              từng trường và tải PDF chuẩn ATS hoàn toàn miễn phí.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-stone-800"
              >
                <BookOpen className="h-4 w-4" />
                Khám phá 6 mẫu trường danh giá
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
              >
                Bắt đầu viết CV ngay (không cần đăng nhập)
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <BookOpen className="mb-3 h-5 w-5 text-amber-600" />
              <h2 className="text-base font-bold text-stone-900">
                1. Học cách viết qua chú thích
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                Mỗi mẫu giữ nguyên nội dung tiếng Anh chuẩn gốc kèm giải thích tiếng Việt: vì
                sao sắp xếp mục đó lên đầu, cách dùng động từ hành động và số liệu.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <Sparkles className="mb-3 h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-stone-900">
                2. Đối chiếu song song & Trợ lý AI
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                Sửa trực tiếp trên mẫu điền sẵn, bật bảng tham khảo bên cạnh và nhờ AI viết
                lại từng dòng theo đúng quy tắc của Harvard, MIT hay Oxford.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <FileCheck2 className="mb-3 h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-stone-900">
                3. PDF chuẩn ATS & Lưu ngay trên máy
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                Không cần tạo tài khoản, không đóng dấu watermark. Xuất file PDF chọn được
                chữ (hỗ trợ đầy đủ tiếng Việt & tiếng Anh) chỉ với 1 cú bấm.
              </p>
            </div>
          </div>
        </section>

        <RecentCvsBar />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-950">
                Kho mẫu tiêu biểu theo trường
              </h2>
              <p className="text-sm text-stone-600">
                Chọn một trường để xem phân tích chi tiết trước khi bắt đầu viết.
              </p>
            </div>
            <Link
              href="/library"
              className="text-sm font-semibold text-stone-800 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UNIVERSITY_TEMPLATES.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/library/${tpl.slug}`}
                className="group rounded-xl border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: tpl.accentColor }}
                  />
                  <span className="text-[11px] font-medium text-stone-500">
                    {tpl.country}
                  </span>
                </div>
                <h3 className="mt-2 font-bold text-stone-900 group-hover:underline">
                  {tpl.universityName}
                </h3>
                <p className="text-xs text-stone-500">{tpl.field}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
