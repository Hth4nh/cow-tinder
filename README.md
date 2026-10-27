# CowTinder — Hẹn Hò & Ghép Đôi Đồng Cỏ (Animate UI Edition)

Ứng dụng web frontend ghép đôi & khám phá phả hệ bò giống VIP (**CowTinder**), được xây dựng bằng **React 19**, **TypeScript**, **Tailwind CSS v4**, và **Animate UI (`@animate-ui/react` + `motion`)**.

---

## 1. Tính Năng Chính

1. **Quẹt Đồng Cỏ (`SwipeDeck.tsx`)**:
   - Bộ bài quẹt tương tác (Drag & Swipe) theo dõi cử chỉ bằng `useMotionValue` & `useTransform` (0 re-render khi kéo chuột/cảm ứng).
   - Tem trạng thái động (`HỢP ĐỒNG CỎ`, `LƯỚT QUA`, `SIÊU BÒ VIP`) biến thiên theo tọa độ kéo.
   - Đầy đủ phím tắt bàn phím (`←` Bỏ qua, `→` Thả tim, `↑` Siêu Bò, `Backspace`/`Z` Hoàn tác, `Space` Mở sổ phả hệ) chạy cùng hiệu ứng vật lý như chuột.
   - Hiệu ứng pháo sáng hạt (`Particles` & `ParticlesEffect`) khi bấm **Siêu Bò VIP** hoặc **Thả Tim**.
   - Bộ tổng hợp âm thanh **Web Audio API (`moo-sound.ts`)** mô phỏng tiếng kêu *Moooo* theo đúng tần số Hz của từng cá thể bò kèm tiếng chuông đồng cỏ.
2. **Sổ Phả Hệ & Khám Phá Đàn Bò (`ExplorerGrid.tsx`)**:
   - Lưới lọc & sắp xếp mượt mà (`FilterGrid` với `AnimatePresence mode="popLayout"`, `layout`, `spring.reflow`, `transition.fade`).
   - Mở rộng thẻ chi tiết (**Expanding Card**) với `layoutId` đồng bộ (`card-${id}`, `image-${id}`, `title-${id}`) trên `spring.dialog`.
3. **Tương Hợp & Trò Chuyện Đồng Cỏ (`MatchesChat.tsx`)**:
   - Danh sách cuộc trò chuyện hỗ trợ vuốt ngang để hủy ghép đôi (`SwipeRow` với `drag="x"`, `dragDirectionLock`, `spring.slide`, `transition.dismiss`) kèm nút xóa trực quan và tự động chuyển focus (`Rule A17`).
   - Phòng chat trực tiếp với tin nhắn phản hồi tự động, gửi quà *Cỏ Non* và gợi ý câu chào làm quen.
4. **Hồ Sơ Bò Của Tôi & Animate UI Motion Studio (`ProfileSettings.tsx`)**:
   - Chỉnh sửa hồ sơ cá nhân với nút `StatusButton` (`idle` → `loading` → `success`) và nút sao chép mã tai `CopyEarTagButton` giữ nguyên kích thước bằng lưới ẩn (`recipes/swap.md`).
   - **Motion Studio**: Chỉnh trực tiếp `tempo` (`0.7x` → `1.3x`) và `checkAnimation` (`draw` / `pop`) của `<AnimateUIProvider>`, xem bảng thông số `spring` & `transition` co giãn theo thời gian thực.

---

## 2. Kiến Trúc & Hợp Đồng Mô-đun (EGM Contracts)

### Interface
- Entrypoint: `src/main.tsx` → `src/App.tsx` (`<AnimateUIProvider tempo={tempo} checkAnimation={checkAnimation}>`).
- Thiết kế chi tiết: [`docs/designs/cow-tinder-frontend.md`](docs/designs/cow-tinder-frontend.md).

### Invariants (Bất biến chất lượng Animate UI)
- **A1 (Reduced Motion)**: 10/10 file có chuyển động đều bọc trong `<ReducedMotionConfig>` và trung hòa chuỗi `transform` bằng `useShouldReduceMotion()`.
- **A2 (Keyboard Parity)**: Điều khiển bàn phím kích hoạt đúng cùng một chuỗi chuyển động như con trỏ.
- **A8 / A9 / A11 (Performance)**: Chỉ hoạt hóa `transform`, `opacity`, `filter`; sử dụng chuỗi `transform` trên compositor cho thao tác nhấn (`scale.press`, `scale.choice`); không dùng `transition-all`.
- **A10 (Zero State Re-render on Drag)**: Mọi cử chỉ kéo thẻ bài và vuốt hàng đều đi qua `useMotionValue` và `useTransform`.

### Side Effects
- Cài đặt giao diện Sáng/Tối cập nhật class `dark` trên `document.documentElement` thông qua View Transition của `ThemeToggler`.
- Bộ phát âm thanh `playMooSound` khởi tạo `AudioContext` khi người dùng tương tác.

---

## 3. Khởi Chạy & Triển Khai Cloudflare Workers (CFW)

```bash
pnpm install
pnpm run dev        # Chạy máy chủ phát triển Vite
pnpm run lint       # Kiểm tra kiểu TypeScript (tsc --noEmit)
pnpm run build      # Đóng gói bản dựng Production vào dist/
pnpm run cf:dev     # Chạy thử môi trường Cloudflare Workers cục bộ (Wrangler)
pnpm run cf:deploy  # Build & deploy trực tiếp lên Cloudflare Workers Static Assets
pnpm dlx @animate-ui/cli@latest audit src  # Kiểm định chất lượng chuyển động Animate UI
```
