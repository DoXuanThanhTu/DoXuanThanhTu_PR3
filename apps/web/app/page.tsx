// import Categories from "@/components/Category";

import HomePage from "../components/HomePage";

const Homepage = () => {
  return (
    <main className="bg-gray-950 text-white min-h-screen">
      {/* 🔹 Phần slide nổi bật */}
      <section className="relative">{/* <TopSlide /> */}</section>

      {/* 🔹 Khoảng đệm mượt giữa slider và nội dung */}
      <div className="h-10 bg-gradient-to-b from-gray-900 to-gray-950" />

      {/* 🔹 Danh mục (nếu có) */}
      {/* <section className="px-4 md:px-8 lg:px-16 py-6">
        <Categories />
      </section> */}

      {/* 🔹 Nội dung chính của trang chủ */}
      <section className="px-4 md:px-8 lg:px-16 pb-12">
        <HomePage />
      </section>
    </main>
  );
};

export default Homepage;
